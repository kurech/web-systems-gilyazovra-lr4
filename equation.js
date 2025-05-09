const a = 6;

function calculateY(x) {
    return 8 * a * Math.pow(x, 4) - 4 * a * x + 0.5;
}

function calculateDerivative(x) {
    return 32 * a * Math.pow(x, 3) - 4 * a;
}

function findRootsNewton(f, df, initialGuess, tolerance = 1e-6, maxIterations = 100) {
    let x = initialGuess;
    for (let i = 0; i < maxIterations; i++) {
        const fx = f(x);
        if (Math.abs(fx) < tolerance) return x;
        const dfx = df(x);
        if (dfx === 0) break;
        x = x - fx / dfx;
    }
    return null;
}

function findRootsBisection(f, a, b, tolerance = 1e-6, maxIterations = 100) {
    if (f(a) * f(b) >= 0) return null;
    
    let c = a;
    for (let i = 0; i < maxIterations; i++) {
        c = (a + b) / 2;
        if (f(c) === 0 || (b - a) / 2 < tolerance) return c;
        
        if (f(c) * f(a) < 0) {
            b = c;
        } else {
            a = c;
        }
    }
    return c;
}

function calculateIntegral(f, start, end, step = 0.01) {
    let integral = 0;
    for (let x = start; x < end; x += step) {
        integral += f(x) * step;
    }
    return integral;
}

function displayResultsOnPage(results) {
    const container = document.createElement('div');
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.maxWidth = '800px';
    container.style.margin = '20px auto';
    container.style.padding = '20px';
    container.style.border = '1px solid #ccc';
    container.style.borderRadius = '5px';
    container.style.backgroundColor = '#f9f9f9';
    
    const title = document.createElement('h2');
    title.textContent = `Анализ функции Y = 8*${a}*x^4 - 4*${a}*x + 0.5`;
    title.style.color = '#333';
    title.style.borderBottom = '1px solid #ddd';
    title.style.paddingBottom = '10px';
    
    const content = document.createElement('pre');
    content.textContent = results;
    content.style.whiteSpace = 'pre-wrap';
    content.style.wordWrap = 'break-word';
    content.style.backgroundColor = '#fff';
    content.style.padding = '15px';
    content.style.borderRadius = '5px';
    content.style.overflowX = 'auto';
    
    container.appendChild(title);
    container.appendChild(content);
    
    document.body.appendChild(container);
}

function analyzeFunction() {
    const start = parseFloat(prompt("Введите начало интервала (по умолчанию -10):", "-10")) || -10;
    const end = parseFloat(prompt("Введите конец интервала (по умолчанию 10):", "10")) || 10;
    
    if (start >= end) {
        alert("Начало интервала должно быть меньше конца!");
        return;
    }
    
    const step = 0.01;
    
    let minY = Infinity;
    let maxY = -Infinity;
    let minX = start;
    let maxX = start;
    
    const roots = [];
    let prevY = calculateY(start);
    
    for (let x = start; x <= end; x += step) {
        const y = calculateY(x);
        
        if (y < minY) {
            minY = y;
            minX = x;
        }
        if (y > maxY) {
            maxY = y;
            maxX = x;
        }
        
        if (prevY * y <= 0 && x !== start) {
            const root = findRootsBisection(calculateY, x - step, x);
            if (root !== null) {
                roots.push(root);
            }
        }
        prevY = y;
    }
    
    const derivativeRoots = [];
    for (let guess = start; guess <= end; guess += 1) {
        const root = findRootsNewton(calculateDerivative, x => 96 * a * x * x, guess);
        if (root !== null && root >= start && root <= end) {
            if (!derivativeRoots.some(r => Math.abs(r - root) < 0.1)) {
                derivativeRoots.push(root);
            }
        }
    }
    
    const integral = calculateIntegral(calculateY, start, end, step);
    
    let result = `Анализ функции на интервале [${start}, ${end}]:\n\n`;
    result += `Минимальное значение: Y = ${minY.toFixed(4)} при x = ${minX.toFixed(4)}\n`;
    result += `Максимальное значение: Y = ${maxY.toFixed(4)} при x = ${maxX.toFixed(4)}\n\n`;
    
    result += `Корни уравнения (Y=0):\n`;
    if (roots.length > 0) {
        roots.forEach((root, i) => {
            result += `Корень ${i + 1}: x = ${root.toFixed(4)}\n`;
        });
    } else {
        result += `Корней не найдено\n`;
    }
    
    result += `\nЭкстремумы функции:\n`;
    if (derivativeRoots.length > 0) {
        derivativeRoots.forEach((root, i) => {
            const y = calculateY(root);
            result += `Экстремум ${i + 1}: x = ${root.toFixed(4)}, Y = ${y.toFixed(4)}\n`;
        });
    } else {
        result += `Экстремумов не найдено\n`;
    }
    
    result += `\nЗначение интеграла на интервале: ${integral.toFixed(4)}`;
    
    alert(result);
    displayResultsOnPage(result);
}

window.onload = analyzeFunction;