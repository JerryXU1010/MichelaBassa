const elementMap = {
    1: "氢",
    4: "氦",
    7: "锂",
    9: "铍",
    11: "硼",
    12: "碳",
    14: "氮",
    16: "氧",
    19: "氟",
    20: "氖",
    23: "钠",
    24: "镁",
    27: "铝",
    28: "硅",
    31: "磷",
    32: "硫",
    35: "氯",
    39: "钾",
    40: "氩",
};

function processText() {
    const operation = document.getElementById("operation").value; // 1: 加密, 2: 解密
    const method = document.getElementById("method").value; // 选择的加密/解密方式
    const inputText = document.getElementById("inputText").value;
    let result = "";

    if (method === "element") {
        result =
            operation === "1" ? elementEncrypt(inputText) : elementDecrypt(inputText);
    } else if (method === "base64") {
        result =
            operation === "1" ? base64Encrypt(inputText) : base64Decrypt(inputText);
    } else if (method === "caesar") {
        const shift = parseInt(document.getElementById("caesarShift").value);
        result =
            operation === "1"
                ? caesarEncrypt(inputText, shift)
                : caesarDecrypt(inputText, shift);
    } else if (method === "rot13") {
        result = rot13(inputText);
    } else if (method === "morse") {
        result =
            operation === "1" ? morseEncrypt(inputText) : morseDecrypt(inputText);
    } else if (method === "aes") {
        var key = document.getElementById("aesPassword").value;
        result =
            operation === "1"
                ? aesEncrypt(inputText, key)
                : aesDecrypt(inputText, key);
    }

    document.getElementById("result").value = result;
}

// 化学元素加密
function elementEncrypt(text) {
    const mass = [
        0, 1, 4, 7, 9, 11, 12, 14, 16, 19, 20, 23, 24, 27, 28, 31, 32, 35, 40, 39,
        40,
    ];
    const find = (x) => mass.includes(x);

    // 处理任意长度的Unicode字符
    const bin = (x) => {
        let res = x.toString(2).padStart(16, "0"); // 将每个字符的Unicode编码转换为16位的二进制
        return res.length > 16 ? "ERROR" : res;
    };

    let res = "";
    for (let char of text) {
        let binValue = bin(char.charCodeAt(0)); // 获取字符的Unicode编码并转换为二进制
        for (let bit of binValue) {
            let tmp = Math.floor(Math.random() * 39) + 1;
            if (bit === "1") {
                while (!find(tmp) || tmp % 2 === 0) tmp++;
            } else {
                while (!find(tmp) || tmp % 2 === 1) tmp++;
            }
            res += elementMap[tmp] || "";
        }
    }
    return res;
}

// 化学元素解密
function elementDecrypt(text) {
    const reverseMap = {};
    for (const [key, value] of Object.entries(elementMap)) {
        reverseMap[value] = key;
    }

    let res = "";
    let binary = "";
    for (let i = 0; i < text.length; i++) {
        const element = text[i];
        let atomicNumber = reverseMap[element];
        if (atomicNumber % 2 === 1) {
            binary += "1";
        } else {
            binary += "0";
        }

        // 每16位为一个字符的二进制编码
        if (binary.length === 16) {
            let charCode = parseInt(binary, 2); // 将二进制转换为整数
            res += String.fromCharCode(charCode); // 将整数转换为字符
            binary = "";
        }
    }
    return res;
}

// Base64 加密
function base64Encrypt(text) {
    return btoa(utf8Encode(text));
}

function base64Decrypt(text) {
    try {
        return utf8Decode(atob(text));
    } catch (e) {
        return "解密失败，输入的Base64格式不正确";
    }
}

function utf8Encode(text) {
    return unescape(encodeURIComponent(text));
}

function utf8Decode(text) {
    try {
        return decodeURIComponent(escape(text));
    } catch (e) {
        return "解码失败，输入的格式不正确";
    }
}

// 凯撒密码加密
function caesarEncrypt(text, shift) {
    return text
        .split("")
        .map((char) => {
            if (char.match(/[a-z]/i)) {
                const code = char.charCodeAt(0);
                const base = char >= "a" ? 97 : 65;
                return String.fromCharCode(((code - base + shift) % 26) + base);
            }
            return char;
        })
        .join("");
}

function caesarDecrypt(text, shift) {
    return caesarEncrypt(text, 26 - shift);
}

// ROT13加密和解密
function rot13(text) {
    return text.replace(/[a-zA-Z]/g, function (char) {
        const base = char <= "Z" ? 65 : 97;
        return String.fromCharCode(((char.charCodeAt(0) - base + 13) % 26) + base);
    });
}

// 摩斯密码映射表
const morseCode = {
    A: ".-",
    B: "-...",
    C: "-.-.",
    D: "-..",
    E: ".",
    F: "..-.",
    G: "--.",
    H: "....",
    I: "..",
    J: ".---",
    K: "-.-",
    L: ".-..",
    M: "--",
    N: "-.",
    O: "---",
    P: ".--.",
    Q: "--.-",
    R: ".-.",
    S: "...",
    T: "-",
    U: "..-",
    V: "...-",
    W: ".--",
    X: "-..-",
    Y: "-.--",
    Z: "--..",
    1: ".----",
    2: "..---",
    3: "...--",
    4: "....-",
    5: ".....",
    6: "-....",
    7: "--...",
    8: "---..",
    9: "----.",
    0: "-----",
    " ": "/",
    ".": ".-.-.-",
    ",": "--..--",
};

// 摩斯密码加密
function morseEncrypt(text) {
    return text
        .toUpperCase()
        .split("")
        .map((char) => morseCode[char] || "")
        .join(" ");
}

// 摩斯密码解密
function morseDecrypt(morse) {
    const reversedMorseCode = Object.entries(morseCode).reduce(
        (acc, [key, value]) => {
            acc[value] = key;
            return acc;
        },
        {}
    );
    return morse
        .split(" ")
        .map((code) => reversedMorseCode[code] || "")
        .join("");
}

// AES加密
function aesEncrypt(text, key) {
    return CryptoJS.AES.encrypt(text, key).toString();
}

// AES解密
function aesDecrypt(text, key) {
    var bytes = CryptoJS.AES.decrypt(text, key);
    var result = bytes.toString(CryptoJS.enc.Utf8);

    if (!result) {
        return '解密失败，密码错误';
    }
    return result;
}

function toggleCaesarShift() {
    var method = document.getElementById("method").value;
    var caesarShiftDiv = document.getElementById("caesarShiftDiv");
    var aesPasswordDiv = document.getElementById("aesPasswordDiv");

    if (method === "caesar") {
        caesarShiftDiv.style.display = "block";
        aesPasswordDiv.style.display = "none";
    } else if (method === "aes") {
        aesPasswordDiv.style.display = "block";
        caesarShiftDiv.style.display = "none";
    } else {
        caesarShiftDiv.style.display = "none";
        aesPasswordDiv.style.display = "none";
    }
}

// 控制密码显示和隐藏
function togglePasswordVisibility() {
    var passwordInput = document.getElementById("aesPassword");
    var passwordIcon = document.getElementById("passwordIcon");

    if (passwordInput.type === "password") {
        passwordInput.type = "text";  // 切换为显示密码
        passwordIcon.src = "eye-icon.svg";  // 切换图标
    } else {
        passwordInput.type = "password";  // 切换为隐藏密码
        passwordIcon.src = "eye-blind-icon.svg";  // 切换回原图标
    }
}
