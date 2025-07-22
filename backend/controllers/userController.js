import userModel from "../models/userModel.js";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    return jwt.sign({id},process.env.JWT_SECRET)
}

//route for user login
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Input validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Please provide both email and password" 
            });
        }

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: "User doesn't exist" 
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials" 
            });
        }

        const token = createToken(user._id);
        
        res.status(200).json({ 
            success: true,
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
    }
}

//router for user register
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check existing user
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.status(400).json({ 
                success: false, 
                message: "User already exists" 
            });
        }

        // Validate email format and password strength
        if (!validator.isEmail(email)) {
            return res.status(400).json({ 
                success: false, 
                message: "Please enter a valid email" 
            });
        }
        
        if (password.length < 8) {
            return res.status(400).json({ 
                success: false, 
                message: "Password must be at least 8 characters long" 
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();
        const token = createToken(user._id);

        res.status(201).json({ 
            success: true,
            token: token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Internal server error",
            error: error.message 
        });
    }
}

//route for admin login
const adminLogin = async (req,res) => {
    try {
        const {email,password} = req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            return res.status(200).json({success:true, token});
    }else{
        return res.status(400).json({success:false, message:"Invalid Credentials"})
    }
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message:error.message})
    }
}


export {
    loginUser,
    registerUser,
    adminLogin
}