const bcrypt = require('bcrypt')
const userModel = require('../Models/UserModel')
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const optSending = require('../helpers/otpSending');
const passwordSending = require('../helpers/forgotPassword');
const { jwtDecode } = require('jwt-decode');
const { default: axios } = require('axios');

exports.register = async (req, res) => {
	const { username, email, password } = req.body
	if (!username || !email || !password) {
		res.status(400).send("Please fill the form")
	}
	else {
		try {
			const existingUser = await userModel.findOne({ email })
			if (existingUser) {
				res.status(409).send({ message: "User already exists" })
			}
			else {
				const saltRounds = 10
				const hashpassword = await bcrypt.hash(password, saltRounds)

				const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })
				const otpExpires = new Date(Date.now() + 10 * 60 * 1000)

				const newUser = await new userModel({
					username, email, password: hashpassword, age: '', gender: '', profilePicture: '', otpExpires, otp
				})    
				newUser.save()
				await optSending(email, otp)
				res.status(201).send({ message: 'newuser added', newUser })
			}
		}
		catch (err) {
			res.status(500).send("Internal server error")
			console.log(err)
		}
	}
}
//login
exports.login = async (req, res) => {
	const { email, password } = req.body
	try {
		const existingUser = await userModel.findOne({ email })
		if (existingUser) {
			const result = await bcrypt.compare(password, existingUser.password)
			if (result) {
				//used for token generation
				const token = jwt.sign({ id: existingUser._id }, 'supersimplekey')
				res.status(200).send({ token, existingUser })
			}
			else {
				res.status(404).send({ message: "Incorrect email or password" })
			}
		} else {
			res.status(404).send({ message: "Account not found" })
		}
	}
	catch (err) {
		res.status(500).send("Internal Server Error")
		console.log(err)
	}
}
// otp verification
exports.otpVerification = async (req, res) => {
	const { otp, email } = req.body
	// console.log(otp)
	try {
		if (!email || !otp) {
			res.status(400).send("invalid email or otp")
		}
		else {

			const existingUser = await userModel.findOne({ email })
			if (!existingUser) {
				return res.status(404).send("User not found")
			}

			if (existingUser.otp != otp) {
				return res.status(400).send("Invalid otp")
			} else {
				const date = new Date(Date.now())
				if (existingUser.otpExpires < date) {
					return res.status(410).send("Time expired")
				}
				existingUser.isVerified = true
				existingUser.otp = null
				existingUser.otpExpires = null
				await existingUser.save()
				res.status(200).send({ message: "Account verified" })
			}

		}
	} catch (error) {
		res.status(500).send("Internal Server Error")
		console.log(error)
	}

}
exports.resendotp = async (req, res) => {
	const { otp, email } = req.body

	try {
		if (!email || !otp) {
			res.status(400).send("invalid email or otp")
		}
		else {
			const existingUser = await userModel.findOne({ email })
			if (!existingUser) {
				return res.status(404).send("User not found")
			}
			const date = new Date(Date.now())
			if (existingUser.otpExpires > date) {
				return res.status(410).send("OTP is still valid")
			}
			else {
				const newotp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false })
				const newotpExpires = new Date(Date.now() + 10 * 60 * 1000)
				existingUser.otp = newotp
				existingUser.otpExpires = newotpExpires
				await existingUser.save()
				await optSending(email, newotp)
				res.status(200).send(" New otp sent")
			}
		}
	} catch (error) {
		res.status(500).send("Internal Server Error")
		console.log(error)
	}
}
exports.forgotPassword = async (req, res) => {
	const { email } = req.body
	// console.log(email)   
	try {
		const existingUser = await userModel.findOne({ email })
		if (!existingUser) {
			return res.status(400).send("Account not found...!!!")
		}
		else {
			const token = jwt.sign({ id: existingUser._id }, 'supersimplekey', { expiresIn: "30m" })
			const baseUrl = process.env.BASE_URL
			const resetLink = `${baseUrl}/resetpassword/${token}`
			await passwordSending(email, resetLink, existingUser.username)
			res.status(200).send("Reset link sent....")
		}
	} catch (error) {
		res.status(500).send("Internal Server Error")
		console.log(error)
	}
}
exports.updatePassword = async (req, res) => {
	const { token, password } = req.body   
	try {
		const decodedToken = jwtDecode(token)
		const existingUser = await userModel.findById(decodedToken.id)
		if (!existingUser) {
			return res.status(404).send("Account not found")
		} else {
			const saltRounds = 10
			const hashpassword = await bcrypt.hash(password, saltRounds)
			existingUser.password = hashpassword
			await existingUser.save()
			res.status(200).send("password Updated")
		}
	} catch (error) {
		res.status(500).send("Internal Server Error")
		console.log(error)
	}
}
//google sign in 
exports.googleSignIn = async (req, res) => {
	const { googleToken } = req.body
	try {  
		if (!googleToken) {
			return res.status(400).send({ message: "Token is required" })
		}  
		const response =  await axios.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${googleToken}`)
		// console.log(response)
		if (response.data.aud != process.env.CLIENT_ID) {
			return res.status(402).send("Invalid Token")
		}
		const name = response.data.name
		const email = response.data.email
		const profilePicture = response.data.picture

		const existingUser = await userModel.findOne({ email })

		if (!existingUser) {
			const newUser = new userModel({
				username: name, email, password: "", age: "", gender: "", profilePicture, otpExpires: "", isVerified: true, otp: ""
			})
			await newUser.save()
			const token = jwt.sign({ id: newUser._id }, 'supersimplekey')
			return res.status(200).send({ token,user: newUser })
		}
		const token = jwt.sign({ id: existingUser._id }, 'supersimplekey')
			res.status(200).send({ token,user: existingUser })
	} catch (error) {
		res.status(500).send("Internal Server Error")
		console.log(error)
	}
}  
//get all users for admin 
exports.getAllUsers = async(req,res)=>{

	try {
		const response = await userModel.find({role:{$ne:1}})
		res.status(200).send(response)
		    
	} catch (error) {
		res.status(500).send("Internal Server Error")
		console.log(error)
	}
}