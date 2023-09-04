const generateRecoveryCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let generatedCode = ''

    for (let i = 0; i < 16; i++) {
        generatedCode += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return generatedCode
} 

export { generateRecoveryCode }