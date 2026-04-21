# Library Management System - Project Root

## Structure

```
PROJECTTTTT/
├── library-management-system/     # Main project
│   ├── models/                    # Data models
│   ├── controllers/               # Business logic
│   ├── utils/                     # Utilities (DB, Auth)
│   ├── app.py                     # CLI application
│   ├── web_app.py                 # Flask REST API
│   ├── requirements.txt           # Dependencies
│   ├── README.md                  # Main documentation
│   ├── API_GUIDE.md               # API reference
│   ├── .env.example               # Environment template
│   └── .gitignore
├── .venv/                         # Python virtual environment (git ignored)
└── .git/                          # Git repository
```

## Quick Start

```bash
# Navigate to project
cd library-management-system

# Install dependencies
pip install -r requirements.txt

# Run CLI demo
python app.py

# Or run REST API server
python web_app.py
```

## Documentation

- **[README.md](library-management-system/README.md)** - Main documentation
- **[API_GUIDE.md](library-management-system/API_GUIDE.md)** - REST API documentation

## Notes

- No external OS-level dependencies required
- Virtual environment (.venv/) is in .gitignore
- All code is self-contained and uses Python standard library (+ Flask for API)
