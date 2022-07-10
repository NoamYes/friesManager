import crypto = require('crypto');
import config from '../config/config';

export function generateHash(toHash: string) {
    return crypto.createHash('sha512').update(toHash).digest('hex');
}

export function encrypt(val: string) {
    const IV = Buffer.from(config.keys.initializationVector); // some string with length of 16
    const ENC_KEY = Buffer.from(config.keys.secretKey); // some string with length of 32

    let cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
    let encrypted = cipher.update(val, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
}

export function decrypt(encrypted: string): string {
    const IV = Buffer.from(config.keys.initializationVector); // some string with length of 16
    const ENC_KEY = Buffer.from(config.keys.secretKey); // some string with length of 32

    let decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    return decrypted + decipher.final('utf8');
}

// const enc = encrypt('123');

// console.log('hash: ' + generateHash('123'));
// console.log('hash cant be decrypted');
// console.log('encrypt: ' + enc);
// console.log('decrypt: ' + decrypt(enc));
