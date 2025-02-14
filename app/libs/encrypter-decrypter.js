const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';
const iv = crypto.randomBytes(16);

const encrypt = (text) => {
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return `${encrypted.toString('hex')}:${iv.toString('hex')}`;
};

const decrypt = (hash) => {
    const hashSplit = hash.split(':');
    const iv = hashSplit[1].toString();
    const newHash = hashSplit[0].toString();
    const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(iv, 'hex'));
    const decrpyted = Buffer.concat([decipher.update(Buffer.from(newHash, 'hex')), decipher.final()]);
    return decrpyted.toString();
};

module.exports = { encrypt, decrypt };
