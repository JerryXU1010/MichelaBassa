// 原子表
const elementMap = {
    1: "氢", 4: "氦", 7: "锂", 9: "铍", 11: "硼",
    12: "碳", 14: "氮", 16: "氧", 19: "氟", 20: "氖",
    23: "钠", 24: "镁", 27: "铝", 28: "硅", 31: "磷",
    32: "硫", 35: "氯", 39: "钾", 40: "氩"
};

// 加密逻辑
function encode(text) {
    const mass = [0, 1, 4, 7, 9, 11, 12, 14, 16, 19, 20, 23, 24, 27, 28, 31, 32, 35, 40, 39, 40];
    const find = (x) => mass.includes(x);
    const bin = (x) => {
        let res = x.toString(2).padStart(7, '0');
        return res.length > 7 ? "ERROR" : res;
    };

    let res = '';
    for (let char of text) {
        let binValue = bin(char.charCodeAt(0));
        for (let bit of binValue) {
            let tmp = Math.floor(Math.random() * 39) + 1;
            if (bit === '1') {
                while (!find(tmp) || tmp % 2 === 0) tmp++;
            } else {
                while (!find(tmp) || tmp % 2 === 1) tmp++;
            }
            res += elementMap[tmp] || '';
        }
    }
    return res;
}

// 解密逻辑
function decode(text) {
    const reverseMap = {};
    for (const [key, value] of Object.entries(elementMap)) {
        reverseMap[value] = key;
    }

    let res = '';
    let binary = '';
    for (let i = 0; i < text.length; i += 1) {
        const element = text[i];
        let atomicNumber = reverseMap[element];
        if (atomicNumber % 2 === 1) {
            binary += '1';
        } else {
            binary += '0';
        }

        if (binary.length === 7) {
            let charCode = parseInt(binary, 2);
            res += String.fromCharCode(charCode);
            binary = '';
        }
    }
    return res;
}

// 处理用户输入
function processText() {
    let operation = document.getElementById("operation").value;
    let inputText = document.getElementById("inputText").value;
    let result = '';

    if (operation === "1") {
        result = encode(inputText);
    } else if (operation === "2") {
        result = decode(inputText);
    }

    document.getElementById("result").innerText = result;
}
