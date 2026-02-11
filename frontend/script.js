// ===== DOM Elements =====
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const uploadArea = document.querySelector('.upload-area');
const fileInput = document.getElementById('fileInput');
const textInput = document.getElementById('textInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const clearBtn = document.getElementById('clearBtn');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultsSection = document.getElementById('resultsSection');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const errorClose = document.querySelector('.error-close');
const downloadBtn = document.getElementById('downloadBtn');
const newAnalysisBtn = document.getElementById('newAnalysisBtn');

// ===== Application State =====
let currentResumeText = '';
let analysisResult = null;

// ===== Mock Job Categories =====
const jobCategories = [
    'Data Science',
    'Web Development',
    'DevOps',
    'Business Analysis',
    'Software Engineering',
    'Cloud Architecture',
    'Mobile Development',
    'Machine Learning',
    'Database Administration',
    'Systems Design'
];

// ===== Tab Switching =====
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.getAttribute('data-tab');
        
        // Remove active class from all buttons and contents
        tabBtns.forEach(b => b.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to clicked button and corresponding content
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');
        
        // Clear inputs when switching tabs
        if (tabName === 'upload') {
            textInput.value = '';
            currentResumeText = '';
        } else {
            fileInput.value = '';
            currentResumeText = '';
        }
    });
});

// ===== File Upload Handling =====
uploadArea.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    handleFileSelect(e.target.files[0]);
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFileSelect(files[0]);
    }
});

// ===== Handle File Selection =====
function handleFileSelect(file) {
    if (!file) return;
    
    const validTypes = ['text/plain', 'application/pdf', 'application/msword',
                       'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!validTypes.includes(file.type) && !file.type.includes('pdf')) {
        showError('Invalid file type. Please upload a PDF, DOC, DOCX, or TXT file.');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
        // For simplicity, we'll extract text from text files
        // In a real app, you'd use a library like pdfjs for PDFs
        if (file.type === 'text/plain') {
            currentResumeText = e.target.result;
            showSuccessMessage(`File "${file.name}" loaded successfully!`);
        } else {
            // For binary files, show a message and use a placeholder
            currentResumeText = `[Content from ${file.name}]\n\nNote: For PDF and Office documents, the full text extraction would require server-side processing.`;
            showSuccessMessage(`File "${file.name}" prepared for analysis!`);
        }
    };
    
    reader.onerror = () => {
        showError('Error reading file. Please try again.');
    };
    
    // Read the file
    if (file.type === 'text/plain') {
        reader.readAsText(file);
    } else {
        reader.readAsDataURL(file);
    }
}

// ===== Text Input Event =====
textInput.addEventListener('input', () => {
    currentResumeText = textInput.value;
});

// ===== Clear Button =====
clearBtn.addEventListener('click', () => {
    fileInput.value = '';
    textInput.value = '';
    currentResumeText = '';
    resultsSection.classList.add('hidden');
    errorMessage.classList.add('hidden');
});

// ===== Analyze Resume =====
analyzeBtn.addEventListener('click', () => {
    if (!currentResumeText.trim()) {
        showError('Please upload a resume file or paste resume text before analyzing.');
        return;
    }
    
    analyzeResume();
});

function analyzeResume() {
    // Show loading spinner
    loadingSpinner.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    analyzeBtn.disabled = true;
    
    // Simulate API call with setTimeout
    const startTime = performance.now();
    
    setTimeout(() => {
        const endTime = performance.now();
        const processingTime = Math.round(endTime - startTime);
        
        // Simulate analysis
        const result = performMockAnalysis(currentResumeText);
        
        // Hide loading and show results
        loadingSpinner.classList.add('hidden');
        displayResults(result, processingTime);
        
        analyzeBtn.disabled = false;
    }, 1500); // Simulate network delay
}

// ===== Mock Analysis Function =====
function performMockAnalysis(resumeText) {
    // Simple keyword matching for demo purposes
    const lowerText = resumeText.toLowerCase();
    
    const categoryKeywords = {
        'Data Science': ['python', 'machine learning', 'data', 'scikit', 'pandas', 'numpy', 'analytics', 'statistics', 'tensorflow', 'neural'],
        'Web Development': ['html', 'css', 'javascript', 'react', 'vue', 'angular', 'node', 'express', 'webpack', 'frontend', 'backend'],
        'DevOps': ['kubernetes', 'docker', 'ci/cd', 'jenkins', 'terraform', 'ansible', 'aws', 'azure', 'devops', 'deployment', 'infrastructure'],
        'Business Analysis': ['business', 'analysis', 'requirements', 'stakeholder', 'documentation', 'process', 'reporting', 'sql', 'tableau', 'excel'],
        'Software Engineering': ['software', 'engineering', 'design patterns', 'architecture', 'agile', 'scrum', 'java', 'c++', 'system design', 'oop'],
        'Cloud Architecture': ['cloud', 'aws', 'azure', 'gcp', 'architecture', 'distributed', 'scalability', 'microservices', 'serverless', 'cloud'],
        'Mobile Development': ['ios', 'android', 'mobile', 'swift', 'kotlin', 'flutter', 'react native', 'xamarin', 'app development'],
        'Machine Learning': ['machine learning', 'deep learning', 'neural network', 'model', 'training', 'algorithm', 'tensorflow', 'pytorch', 'nlp', 'cv'],
        'Database Administration': ['database', 'sql', 'mysql', 'postgresql', 'oracle', 'mongodb', 'dba', 'backup', 'replication', 'indexing'],
        'Systems Design': ['system design', 'architecture', 'scalable', 'distributed', 'high availability', 'load balancing', 'caching', 'database design']
    };
    
    let scores = {};
    
    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        let score = 0;
        keywords.forEach(keyword => {
            const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
            const matches = resumeText.match(regex);
            score += matches ? matches.length : 0;
        });
        scores[category] = score;
    }
    
    // Find the category with the highest score
    let maxScore = Math.max(...Object.values(scores));
    const detectedCategory = maxScore > 0 
        ? Object.keys(scores).find(cat => scores[cat] === maxScore)
        : jobCategories[Math.floor(Math.random() * jobCategories.length)];
    
    // Calculate confidence as a percentage
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const confidence = totalScore > 0 ? Math.round((maxScore / totalScore) * 100) : 45 + Math.floor(Math.random() * 30);
    
    return {
        category: detectedCategory,
        confidence: Math.max(45, Math.min(99, confidence)), // Ensure between 45-99
        resumeText: currentResumeText,
        timestamp: new Date().toLocaleString()
    };
}

// ===== Display Results =====
function displayResults(result, processingTime) {
    analysisResult = result;
    
    // Update results
    document.getElementById('categoryResult').textContent = result.category;
    document.getElementById('confidenceText').textContent = `${result.confidence}% Confidence`;
    document.getElementById('confidenceFill').style.width = `${result.confidence}%`;
    
    // Update resume preview
    const previewText = result.resumeText.substring(0, 500) + 
                        (result.resumeText.length > 500 ? '...' : '');
    document.getElementById('resumePreview').textContent = previewText;
    
    // Update stats
    document.getElementById('charCount').textContent = result.resumeText.length.toLocaleString();
    document.getElementById('wordCount').textContent = result.resumeText.split(/\s+/).filter(w => w).length;
    document.getElementById('processingTime').textContent = `${processingTime}ms`;
    
    // Show results section
    resultsSection.classList.remove('hidden');
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// ===== Download Results =====
downloadBtn.addEventListener('click', () => {
    if (!analysisResult) return;
    
    const content = generateReportContent();
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
    element.setAttribute('download', `resume_analysis_${Date.now()}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
});

function generateReportContent() {
    const { category, confidence, resumeText, timestamp } = analysisResult;
    
    return `=====================================
        AI RESUME ANALYZER - ANALYSIS REPORT
    =====================================

    Generated: ${timestamp}

    DETECTED JOB CATEGORY
    ${category}

    CONFIDENCE SCORE
    ${confidence}%

    RESUME CONTENT
    ${resumeText}

    =====================================
    Report generated by AI Resume Analyzer
    =====================================`;
}

// ===== New Analysis =====
newAnalysisBtn.addEventListener('click', () => {
    clearBtn.click();
    textInput.focus();
});

// ===== Error Handling =====
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

function showSuccessMessage(message) {
    // You could implement a success toast here
    console.log('Success:', message);
}

errorClose.addEventListener('click', () => {
    errorMessage.classList.add('hidden');
});

// ===== Keyboard Shortcuts =====
document.addEventListener('keydown', (e) => {
    // Ctrl+Enter or Cmd+Enter to analyze
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        analyzeBtn.click();
    }
    
    // Escape to close error
    if (e.key === 'Escape') {
        errorMessage.classList.add('hidden');
    }
});

// ===== Initialize =====
function init() {
    // Set up event listeners
    setupAccessibility();
    
    // Focus first input
    textInput.focus();
}

// ===== Accessibility Setup =====
function setupAccessibility() {
    // Ensure all interactive elements are keyboard accessible
    analyzeBtn.setAttribute('aria-label', 'Analyze resume');
    clearBtn.setAttribute('aria-label', 'Clear all inputs');
    downloadBtn.setAttribute('aria-label', 'Download analysis report');
    newAnalysisBtn.setAttribute('aria-label', 'Start new analysis');
}

// ===== Local Storage for Draft =====
// Save resume text to localStorage periodically
textInput.addEventListener('input', () => {
    localStorage.setItem('resumeDraft', textInput.value);
});

// Restore draft on page load
window.addEventListener('load', () => {
    const draft = localStorage.getItem('resumeDraft');
    if (draft) {
        textInput.value = draft;
        currentResumeText = draft;
    }
    
    // Initialize the app
    init();
});

// ===== Export for potential backend integration =====
window.ResumeAnalyzer = {
    analyze: analyzeResume,
    getResult: () => analysisResult,
    setMockCategories: (categories) => {
        jobCategories.length = 0;
        jobCategories.push(...categories);
    }
};

// ===== Demo Data =====
// Uncomment this to auto-fill with demo data for testing
/*
document.addEventListener('DOMContentLoaded', () => {
    const demoResume = `John Doe
Senior Data Scientist | Machine Learning Engineer

PROFESSIONAL SUMMARY
Experienced Data Scientist with 8+ years in developing machine learning models and data analytics solutions. 
Proficient in Python, SQL, and various ML frameworks. Strong background in statistical analysis and data visualization.

TECHNICAL SKILLS
- Languages: Python, SQL, R, JavaScript
- Machine Learning: Scikit-learn, TensorFlow, PyTorch, Keras
- Data Analysis: Pandas, NumPy, Matplotlib, Seaborn
- Databases: MySQL, PostgreSQL, MongoDB
- Cloud: AWS, Google Cloud Platform
- Tools: Jupyter, Git, Docker

EXPERIENCE
Senior Data Scientist | Tech Corp (2020 - Present)
- Developed ML models for customer segmentation and recommendation systems
- Built data pipelines using Apache Spark
- Improved model accuracy by 25% through feature engineering

Data Scientist | Analytics Inc (2017 - 2020)
- Implemented NLP models for sentiment analysis
- Created dashboards and reports for stakeholders
- Mentored junior data scientists

EDUCATION
Master of Science in Data Science | University (2017)
Bachelor of Science in Statistics | University (2015)`;
    
    textInput.value = demoResume;
    currentResumeText = demoResume;
});
*/
