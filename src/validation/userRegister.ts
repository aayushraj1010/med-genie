import {z} from 'zod'

export const registerSchema = z.object({
    name : z.string().min(6 , "Name minimum of 6 characters"),
    email : z.string().email("Invalid email address"),
    password : z.string().min(6 , "Password must be Minimum of 6 length").max(20 , "Password must be Maximum of 20 length"),
    confirmPassword : z.string().min(6 , "Password must be Minimum of 6 length").max(20 , "Password must be Maximum of 20 length")

})