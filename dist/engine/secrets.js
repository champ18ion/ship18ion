"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECRET_PATTERNS = void 0;
exports.calculateEntropy = calculateEntropy;
exports.isHighEntropy = isHighEntropy;
exports.SECRET_PATTERNS = [
    { name: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/ },
    { name: 'Google API Key', regex: /AIza[0-9A-Za-z\\-_]{35}/ },
    { name: 'Stripe Secret Key', regex: /sk_live_[0-9a-zA-Z]{24}/ },
    { name: 'GitHub Personal Access Token', regex: /ghp_[0-9a-zA-Z]{36}/ },
    { name: 'Generic Private Key', regex: /-----BEGIN .* PRIVATE KEY-----/ },
    { name: 'Slack Bot Token', regex: /xoxb-[0-9]{11}-[0-9]{12}-[0-9a-zA-Z]{24}/ },
    { name: 'OpenAI API Key', regex: /sk-[a-zA-Z0-9]{48}/ }
];
function calculateEntropy(str) {
    const len = str.length;
    const frequencies = Array.from(str).reduce((freq, char) => {
        freq[char] = (freq[char] || 0) + 1;
        return freq;
    }, {});
    return Object.values(frequencies).reduce((sum, f) => {
        const p = f / len;
        return sum - (p * Math.log2(p));
    }, 0);
}
function isHighEntropy(str, threshold = 4.5) {
    return calculateEntropy(str) > threshold;
}
