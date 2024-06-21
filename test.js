// const express = require('express');
// const fs = require('fs');
// const pdfParse = require('pdf-parse');

// const app = express();

// // Endpoint to handle PDF parsing and respond with extracted text
// app.get('/response', async (req, res) => {
//     const filePath = "10.1.1.83.5248.pdf" // Assuming the PDF path is passed as a query parameter
//     if (!filePath) {
//         return res.status(400).send({ error: 'Path to PDF file is required' });
//     }

//     try {
//         const dataBuffer = fs.readFileSync("10.1.1.83.5248.pdf");
//         const data = await pdfParse(dataBuffer);

//         // Respond with the extracted text in JSON format
//         res.json({
//             text: data.text,
//             numPages: data.numpages,
//             pageCount: data.pagecount,
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ error: 'Failed to process the PDF file' });
//     }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');
// const fs = require('fs'); // For reading the PDF file
// const pdfParse = require('pdf-parse'); // Simulated PDF parsing
// const app = express();
// const port = process.env.PORT || 3000;

// app.use(express.json());

// async function extractInsightsFromPdf(path) {
//     try {
//         const dataBuffer = fs.readFileSync(path);
//         const data = await pdfParse(dataBuffer); // Simulated PDF parsing
//         // Simulate extracting abstract and keywords
//         const abstract = data.text.substring(0, 200); // First 200 characters as abstract
//         const keywords = data.text.split('.').slice(0, 5).join(', '); // First five sentences as keywords
//         return { abstract, keywords };
//     } catch (error) {
//         console.error(error);
//         throw new Error('Failed to process the PDF file');
//     }
// }

// app.get('/insight', async (req, res) => {
//     const path = "10.1.1.83.5248.pdf"; // Path to the PDF file
//     if (!path) {
//         return res.status(400).send({ error: 'Path to PDF file is required' });
//     }
//     try {
//         const insights = await extractInsightsFromPdf(path);
//         res.json(insights);
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ error: 'Failed to extract insights from the PDF file' });
//     }
// });

// app.post('/analyze', async (req, res) => {
//     const path = "10.1.1.83.5248.pdf"; // Path to the PDF file inside the request body
//     const message = req.body.message; // Message to analyze
//     if (!path ||!message) {
//         return res.status(400).send({ error: 'Both path and message are required' });
//     }
//     try {
//         const insights = await extractInsightsFromPdf(path);
//         // Simulate analyzing the message based on the extracted insights
//         const analysisResult = `Analyzing "${message}" based on the insights from the PDF.`; // Placeholder for actual analysis
//         res.json({ analysisResult,...insights });
//     } catch (error) {
//         console.error(error);
//         res.status(500).send({ error: 'Failed to analyze the message' });
//     }
// });

// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });


const express = require('express');
const axios = require('axios');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const app = express();

// Hardcoded port for simplicity
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

async function extractInsightsFromPdf(path) {
    try {
        const dataBuffer = fs.readFileSync(path);
        const data = await pdfParse(dataBuffer);
        const pdfText = data.text;
        const prompt = `Extract the abstract and keywords from the following PDF text:\n\n${pdfText}`;
        const response = await axios.post('https://api.openai.com/v1/engines/davinci-codex/completions', {
            prompt,
            max_tokens: 150,
        }, {
            headers: {
                'Authorization': `Bearer YOUR_OPENAI_API_KEY`,
                'Content-Type': 'application/json'
            },
        });
        const result = response.data.choices[0].text.trim().split('\n');
        const abstract = result[0];
        const keywords = result.slice(1, -1).join(', ');
        return { abstract, keywords };
    } catch (error) {
        console.error(error);
        throw new Error('Failed to process the PDF file');
    }
}

app.get('/insight', async (req, res) => {
    const path = "32182.pdf"; // Simulated PDF path
    if (!path) {
        return res.status(400).send({ error: 'Path to PDF file is required' });
    }
    try {
        const insights = await extractInsightsFromPdf(path);
        res.json(insights);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to extract insights from the PDF file' });
    }
});

app.post('/analyze', async (req, res) => {
    const path = "32182.pdf"; // Simulated PDF path
    const message = req.body.message; // Message to analyze
    if (!path ||!message) {
        return res.status(400).send({ error: 'Both path and message are required' });
    }
    try {
        const insights = await extractInsightsFromPdf(path);
        const analysisResult = `Analyzing "${message}" based on the insights from the PDF.`; // Placeholder for actual analysis
        res.json({ analysisResult,...insights });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to analyze the message' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
