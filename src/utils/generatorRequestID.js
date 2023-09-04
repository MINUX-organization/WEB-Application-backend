const generateRequestID = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let generatedID = ''

    for (let i = 0; i < 32; i++) {
        generatedID += chars.charAt(Math.floor(Math.random() * chars.length))
    }

    return generatedID
}

export { generateRequestID }