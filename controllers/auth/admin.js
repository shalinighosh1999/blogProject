const test = async (req, res) => {
    try {
        const data = "hello";
        res.status(200).json({ message: data });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
}


module.exports={test}