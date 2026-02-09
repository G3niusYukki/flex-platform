/**
 * 敏感数据加密服务
 * AES-256-GCM 加密身份证、健康证等图片 URL
 */

import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.DATA_ENCRYPTION_KEY || 'default-key-32-characters-long!';
const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;

/**
 * 加密敏感数据
 */
export function encrypt(text: string): string {
    const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
    const iv = crypto.randomBytes(IV_LENGTH);

    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    // 格式: iv:authTag:encryptedData
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

/**
 * 解密敏感数据
 */
export function decrypt(encryptedText: string): string | null {
    try {
        const parts = encryptedText.split(':');
        if (parts.length !== 3) return null;

        const [ivHex, authTagHex, encrypted] = parts;
        const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
        const iv = Buffer.from(ivHex, 'hex');
        const authTag = Buffer.from(authTagHex, 'hex');

        const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
        decipher.setAuthTag(authTag);

        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    } catch (error) {
        console.error('解密失败:', error);
        return null;
    }
}

/**
 * 加密身份证图片 URL
 */
export function encryptIdCardUrl(url: string): string {
    return encrypt(url);
}

/**
 * 解密身份证图片 URL
 */
export function decryptIdCardUrl(encryptedUrl: string): string | null {
    return decrypt(encryptedUrl);
}

/**
 * 加密健康证图片 URL
 */
export function encryptHealthCertUrl(url: string): string {
    return encrypt(url);
}

/**
 * 解密健康证图片 URL
 */
export function decryptHealthCertUrl(encryptedUrl: string): string | null {
    return decrypt(encryptedUrl);
}

/**
 * 脱敏手机号 (138****0000)
 */
export function maskPhone(phone: string): string {
    if (!phone || phone.length < 11) return phone;
    return phone.slice(0, 3) + '****' + phone.slice(-4);
}

/**
 * 脱敏身份证号 (110***********1234)
 */
export function maskIdCard(idCard: string): string {
    if (!idCard || idCard.length < 18) return idCard;
    return idCard.slice(0, 3) + '***********' + idCard.slice(-4);
}

/**
 * 脱敏姓名 (张*)
 */
export function maskName(name: string): string {
    if (!name || name.length < 2) return name;
    return name[0] + '*'.repeat(name.length - 1);
}

/**
 * 生成安全的临时访问 URL
 * 用于前端短时间内访问加密的图片
 */
export function generateSecureUrl(encryptedUrl: string, expiresIn: number = 300): string {
    const timestamp = Date.now();
    const expires = timestamp + expiresIn * 1000;
    const data = `${encryptedUrl}:${expires}`;
    const signature = crypto
        .createHmac('sha256', ENCRYPTION_KEY)
        .update(data)
        .digest('hex');

    return `${encryptedUrl}?expires=${expires}&sig=${signature}`;
}

/**
 * 验证临时访问 URL
 */
export function verifySecureUrl(url: string): { valid: boolean; decryptedUrl: string | null } {
    try {
        const [encryptedPart, queryString] = url.split('?');
        if (!queryString) return { valid: false, decryptedUrl: null };

        const params = new URLSearchParams(queryString);
        const expires = parseInt(params.get('expires') || '0', 10);
        const signature = params.get('sig');

        // 检查过期
        if (Date.now() > expires) {
            return { valid: false, decryptedUrl: null };
        }

        // 验证签名
        const data = `${encryptedPart}:${expires}`;
        const expectedSig = crypto
            .createHmac('sha256', ENCRYPTION_KEY)
            .update(data)
            .digest('hex');

        if (signature !== expectedSig) {
            return { valid: false, decryptedUrl: null };
        }

        // 解密
        const decryptedUrl = decrypt(encryptedPart);
        return { valid: true, decryptedUrl };
    } catch {
        return { valid: false, decryptedUrl: null };
    }
}
