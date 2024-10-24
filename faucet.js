const axios = require('axios');
const readline = require('readline');

// Function to claim tokens
async function claimTokens(address) {
    const url = 'https://faucet.testnet.humanity.org/api/claim';

    const payload = {
        address: address
    };

    const headers = {
        'Content-Type': 'application/json',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
    };

    try {
        const response = await axios.post(url, payload, { headers });
        console.log("Response Status:", response.status);
        console.log("Response Data:", response.data);
    } catch (error) {
        if (error.response) {
            console.error("Error Response Status:", error.response.status);
            console.error("Error Response Data:", error.response.data);
        } else {
            console.error("Error:", error.message);
        }
    }
}

// Function to auto-loop the claimTokens function
async function autoLoop(address, totalLoops, delay) {
    while (true) {
        for (let i = 0; i < totalLoops; i++) {
            await claimTokens(address);
        }
        // Wait for the specified delay after completing the loops
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}

// Set up readline for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to get user input
const getUserInput = () => {
    return new Promise((resolve) => {
        rl.question('Enter Ethereum address: ', (address) => {
            rl.question('Enter total loops (e.g., 50): ', (totalLoops) => {
                rl.question('Enter delay in seconds (e.g., 3600): ', (delay) => {
                    rl.close();
                    resolve({
                        address,
                        totalLoops: parseInt(totalLoops, 10),
                        delay: parseInt(delay, 10) * 1000 // Convert to milliseconds
                    });
                });
            });
        });
    });
};

// Main function to start the bot
const startBot = async () => {
    const { address, totalLoops, delay } = await getUserInput();

    if (address && totalLoops > 0 && delay > 0) {
        autoLoop(address, totalLoops, delay);
    } else {
        console.error("Invalid input. Please ensure all values are correct.");
    }
};

// Start the bot
startBot();
