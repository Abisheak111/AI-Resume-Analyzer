# AI Resume Analyzer - Frontend

A modern, responsive web interface for the AI Resume Analyzer project. This frontend allows users to upload resumes or paste text and get instant AI-powered categorization.

## Features

✨ **Modern Interface**
- Clean, professional design with gradient backgrounds
- Responsive layout that works on desktop, tablet, and mobile devices
- Dark mode support

📁 **Flexible Input Methods**
- Upload resume files (PDF, DOC, DOCX, TXT)
- Paste resume text directly
- Drag-and-drop file upload support

🤖 **Smart Analysis**
- AI-powered resume categorization
- Confidence score display with visual progress bar
- Resume content preview
- Word and character count statistics
- Processing time tracking

📥 **Export Results**
- Download analysis reports as text files
- Formatted report with timestamp and all details

♿ **Accessibility**
- Full keyboard navigation support
- ARIA labels for screen readers
- Semantic HTML structure
- High contrast mode support

## File Structure

```
frontend/
├── index.html          # Main HTML structure
├── style.css          # Complete styling with responsive design
├── script.js          # Interactive functionality and logic
└── README.md          # This file
```

## Quick Start

### 1. Open in Browser (Local)

Simply open `index.html` in your web browser:

```bash
# On Windows
start frontend/index.html

# On macOS
open frontend/index.html

# On Linux
xdg-open frontend/index.html
```

### 2. Using a Local Server (Recommended)

For better functionality and to simulate a real deployment:

**Using Python (Python 3):**
```bash
cd frontend
python -m http.server 8000
# Visit http://localhost:8000
```

**Using Python (Python 2):**
```bash
cd frontend
python -m SimpleHTTPServer 8000
# Visit http://localhost:8000
```

**Using Node.js with http-server:**
```bash
npm install -g http-server
cd frontend
http-server
# Visit http://localhost:8080
```

**Using Live Server Extension (VS Code):**
- Install the "Live Server" extension
- Right-click on `index.html`
- Select "Open with Live Server"

### 3. Keyboard Shortcuts

- **Ctrl+Enter** (Cmd+Enter on Mac): Analyze resume
- **Escape**: Close error messages

## How to Use

1. **Input Resume**
   - Choose "Upload File" to select a resume from your computer
   - Or choose "Paste Text" to manually enter resume content
   - Supported formats: PDF, DOC, DOCX, TXT

2. **Analyze**
   - Click the "Analyze Resume" button
   - The AI model will process your resume (simulated with ~1.5 second delay)

3. **View Results**
   - See the detected job category
   - Check the confidence score (visual progress bar)
   - Review your resume content preview
   - View statistics (word count, character count, processing time)

4. **Export**
   - Click "Download Result" to save the analysis report
   - Reports are saved as text files with timestamp

5. **Start Over**
   - Click "New Analysis" to clear all fields and start fresh
   - Or use the "Clear" button to reset inputs

## Customization

### Adding Job Categories

Edit the `jobCategories` array in `script.js`:

```javascript
const jobCategories = [
    'Data Science',
    'Web Development',
    // Add more categories here
    'Your Category'
];
```

### Adjusting Colors

Modify the CSS variables in `style.css`:

```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --success-color: #10b981;
    --error-color: #ef4444;
    /* ... more colors ... */
}
```

### Analysis Delay

Change the timeout in `script.js` (currently 1500ms):

```javascript
setTimeout(() => {
    // Analysis happens here
}, 1500); // Adjust this value
```

## Backend Integration

To connect to the actual Python ML model:

1. **Set up a Flask/FastAPI backend:**
```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/api/analyze', methods=['POST'])
def analyze():
    resume_text = request.json.get('resumeText')
    # Call your ML model here
    result = your_ml_model.predict(resume_text)
    return jsonify(result)
```

2. **Update the frontend in `script.js`:**
```javascript
function analyzeResume() {
    loadingSpinner.classList.remove('hidden');
    analyzeBtn.disabled = true;
    
    fetch('/api/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            resumeText: currentResumeText
        })
    })
    .then(response => response.json())
    .then(data => {
        loadingSpinner.classList.add('hidden');
        displayResults(data, processingTime);
        analyzeBtn.disabled = false;
    })
    .catch(error => {
        showError('Analysis failed: ' + error.message);
        loadingSpinner.classList.add('hidden');
        analyzeBtn.disabled = false;
    });
}
```

## Supported Resume Formats

| Format | Support | Notes |
|--------|---------|-------|
| Text (.txt) | ✅ Full | Direct text extraction |
| PDF | ⚠️ Partial | Requires server-side processing |
| Word (.doc, .docx) | ⚠️ Partial | Requires server-side processing |

For full PDF and Office document support, implement server-side text extraction using libraries like:
- `pdfplumber` (Python)
- `python-docx` (Python)
- `pdfjs` (JavaScript - frontend)

## Browser Compatibility

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Tips

1. **Lazy Loading**: For large files, implement chunked file reading
2. **Debouncing**: The text input auto-saves to localStorage with debouncing
3. **Caching**: Results are cached in memory until new analysis is performed
4. **Service Workers**: Consider adding offline support for saved drafts

## Accessibility Features

- Semantic HTML5 structure
- ARIA labels on all interactive elements
- Keyboard navigation support
- Focus management
- Color contrast meets WCAG AA standards
- Reduced motion support via `prefers-reduced-motion`

## Mobile Optimization

- Fully responsive design
- Touch-friendly button sizes (44px minimum)
- Optimized for portrait and landscape modes
- Mobile-first CSS approach
- Viewport meta tag for proper scaling

## Dark Mode

The interface automatically adapts to system preferences:
- Light mode: Default gradient backgrounds
- Dark mode: High-contrast dark theme

Users can force dark mode by enabling it in their OS preferences.

## Troubleshooting

### File Upload Not Working
- Check file format (should be PDF, DOC, DOCX, or TXT)
- Ensure file size is reasonable (< 10MB)
- Check browser console for errors

### Analysis Taking Too Long
- Check network connection
- Verify backend server is running (if integrated)
- Clear browser cache and try again

### Styling Issues
- Clear browser cache
- Check all CSS files are loaded (open Developer Tools)
- Verify CSS file is in the same directory

## Development

### Project Structure
```
AI-Resume-Analyzer/
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── README.md
├── Resume_Screening.ipynb
├── resume_dataset.csv
└── README.md
```

### Making Changes

1. **HTML Changes**: Modify `index.html` and refresh browser
2. **CSS Changes**: Edit `style.css` and hard refresh (Ctrl+Shift+R)
3. **JavaScript Changes**: Edit `script.js` and refresh page

### Testing

Use browser Developer Tools:
- Open DevTools (F12)
- Check Console for JavaScript errors
- Use Network tab to monitor API calls
- Use Elements tab to inspect HTML/CSS

## Future Enhancements

- [ ] Real-time preview as you type
- [ ] Drag-and-drop reordering of resume sections
- [ ] Multiple file upload and batch analysis
- [ ] Resume templates and suggestions
- [ ] Integration with job posting analyzer
- [ ] User accounts and history
- [ ] Advanced filters and sorting
- [ ] Resume improvement suggestions

## License

This project is part of the AI Resume Analyzer project. See the main README.md for license information.

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For issues or questions:
1. Check this README
2. Review the code comments in HTML/CSS/JS
3. Check browser console for error messages
4. Open an issue on the GitHub repository

---

**Happy Analyzing! 🚀**
