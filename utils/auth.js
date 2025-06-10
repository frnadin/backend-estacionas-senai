import jwt from 'jsonwebtoken';

const secretKey = process.env.SECRET_KEY

if (!secretKey) throw new Error('SECRET_KEY não definida no .env');

 const generateToken = (user) => {
    const payload = { // conteudo do token
        id: user.id,
        email: user.email,
        role: user.role
    };
    
    const options = {
        expiresIn: '1h' 
    };
    
    return jtw.sign(payload, secretKey, options); //criptografa o token
 }
    export const verifyToken = (token) => {
    try {
        return jtw.verify(token, secretKey);
    } catch (error) {
        throw new Error('Token inválido ou expirado');
    }
}