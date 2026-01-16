# Docify - Professional PDF Processing Platform

![Docify Banner](https://via.placeholder.com/1200x300/e74c3c/ffffff?text=Docify+-+PDF+Tools)

A complete, production-ready web application for PDF processing - a full-featured clone of iLovePDF with 21+ tools for converting, organizing, optimizing, editing, and securing PDF documents.

## ✨ Features

### Convert (9 Tools)
- 📄 PDF to Word (.docx)
- 📝 Word to PDF
- 📊 PDF to PowerPoint (.pptx)
- 📽️ PowerPoint to PDF
- 📈 PDF to Excel (.xlsx)
- 📉 Excel to PDF
- 🖼️ PDF to JPG
- 📷 JPG to PDF
- 🎨 Image to PDF (PNG, JPG, etc.)

### Organize (4 Tools)
- 🔗 Merge PDFs
- ✂️ Split PDF (by pages, ranges, or fixed chunks)
- 🔄 Reorder Pages
- 🗑️ Delete Pages

### Optimize (2 Tools)
- 🗜️ Compress PDF (low, medium, high quality)
- 🔧 Repair corrupted PDFs

### Edit (4 Tools)
- ↻ Rotate PDF pages
- 💧 Add Watermarks (text or image)
- 🔢 Add Page Numbers
- 👁️ OCR - Extract text from scanned PDFs

### Secure (2 Tools)
- 🔒 Protect PDF with password
- 🔓 Unlock password-protected PDFs

### Advanced Features
- ⚡ Batch processing (process multiple files at once)
- 📊 Job queue with real-time progress tracking
- 🕒 Auto-delete files after 30 minutes
- 👁️ Client-side file preview
- 🌙 Dark mode support
- 📱 Fully responsive mobile design
- 🔐 Secure file handling
- 📜 Processing history
- 🚀 High-performance processing
- 🎨 Modern, beautiful UI with smooth animations

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **React Dropzone** - File uploads

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **pdf-lib** - PDF manipulation
- **Multer** - File upload handling
- **Winston** - Logging
- **Node-cron** - Scheduled jobs

### PDF Processing
- **pdf-lib** - PDF creation and manipulation
- **pdfjs-dist** - PDF parsing
- **LibreOffice** (headless) - Office document conversions
- **Ghostscript** - PDF compression and optimization
- **ImageMagick** - Image processing
- **Tesseract OCR** - Text extraction from scanned PDFs

### DevOps
- **PM2** - Process manager
- **Nginx** - Reverse proxy
- **MongoDB** - Database

## 📋 Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **MongoDB** (local or remote)
- **Linux** server (Ubuntu 20.04+ recommended)
- **LibreOffice, Ghostscript, ImageMagick, Tesseract** (installed via script)

## 🚀 Quick Start

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd docify

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Install System Dependencies

```bash
# Run the installation script (requires sudo)
sudo ./scripts/install-dependencies.sh
```

This will install:
- LibreOffice (headless)
- Ghostscript
- ImageMagick
- Tesseract UCR
- MongoDB (optional)
- Nginx

### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit configuration
nano .env
```

Key variables to configure:
```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Backend
NODE_ENV=production
PORT=3001
MONGODB_URI=mongodb://localhost:27017/docify

# Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=104857600
FILE_EXPIRY_MINUTES=30

# Security
JWT_SECRET=<your-secret-key>
```

### 4. Build the Application

```bash
# Build frontend
npm run build

# Build backend
cd backend
npm run build
cd ..
```

### 5. Start with PM2

```bash
# Install PM2 globally (if not installed)
npm install -g pm2

# Start applications
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 6. Configure Nginx

```bash
# Copy Nginx configuration
sudo cp nginx/docify.conf /etc/nginx/sites-available/docify

# Create symbolic link
sudo ln -s /etc/nginx/sites-available/docify /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 7. Access the Application

Open your browser and navigate to:
- **http://your-server-ip** (or your configured domain)

## 💻 Development Mode

```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start backend
cd backend
npm run dev
```

Frontend: http://localhost:3000
Backend API: http://localhost:3001

## 📁 Project Structure

```
docify/
├── src/                        # Frontend source
│   ├── app/                    # Next.js pages
│   │   ├── page.tsx           # Homepage
│   │   ├── merge/             # Merge PDF tool
│   │   ├── split/             # Split PDF tool
│   │   ├── compress/          # Compress PDF tool
│   │   └── ...                # Other tools
│   ├── components/            # React components
│   │   ├── FileUpload.tsx
│   │   ├── ProgressIndicator.tsx
│   │   ├── ToolCard.tsx
│   │   └── ...
│   ├── lib/                   # Utilities
│   │   ├── api.ts            # API client
│   │   ├── utils.ts          # Helper functions
│   │   └── tools.ts          # Tool definitions
│   └── types/                 # TypeScript types
│
├── backend/                    # Backend source
│   └── src/
│       ├── server.ts          # Express server
│       ├── config/            # Configuration
│       ├── routes/            # API routes
│       │   ├── upload.ts
│       │   ├── process.ts
│       │   ├── jobs.ts
│       │   └── batch.ts
│       ├── services/          # Business logic
│       │   ├── pdf/          # PDF processing
│       │   │   ├── merge.service.ts
│       │   │   ├── split.service.ts
│       │   │   ├── compress.service.ts
│       │   │   └── rotate.service.ts
│       │   └── storage/      # File management
│       │       └── cleanup.service.ts
│       ├── models/            # Database models
│       │   └── Job.model.ts
│       ├── middleware/        # Express middleware
│       └── utils/             # Utilities
│
├── nginx/                      # Nginx configuration
│   └── docify.conf
│
├── scripts/                    # Deployment scripts
│   └── install-dependencies.sh
│
├── uploads/                    # File storage (generated)
│   ├── temp/                  # Temporary uploads
│   └── results/               # Processed files
│
├── logs/                       # Application logs (generated)
│
├── ecosystem.config.js         # PM2 configuration
├── package.json               # Frontend dependencies
├── backend/package.json       # Backend dependencies
├── tsconfig.json              # TypeScript config
├── tailwind.config.ts         # Tailwind config
├── next.config.ts             # Next.js config
└── .env                       # Environment variables
```

## 🔧 Configuration

### Environment Variables

See `.env.example` for all available options:

- **Server**: Port, environment, frontend URL
- **Database**: MongoDB connection string
- **Storage**: Upload directory, file size limits, expiry time
- **Security**: JWT secret, rate limiting
- **Processing**: Tool paths, concurrent jobs, batch size

### File Size Limits

Default: 100MB per file

To change:
1. Update `MAX_FILE_SIZE` in `.env`
2. Update `client_max_body_size` in Nginx config
3. Restart services

### File Expiry Time

Default: 30 minutes

Files are automatically deleted after expiry. To change:
1. Update `FILE_EXPIRY_MINUTES` in `.env`
2. Restart backend

## 📊 Monitoring

### PM2 Monitoring

```bash
# View status
pm2 status

# View logs
pm2 logs

# Monitor resources
pm2 monit

# View specific app logs
pm2 logs docify-backend
pm2 logs docify-frontend
```

### Logs

Application logs are stored in:
- Frontend: `logs/frontend-*.log`
- Backend: `logs/backend-*.log`
- Backend detailed: `backend/logs/*.log`

## 🔒 Security

### Built-in Security Features

- File type validation (MIME type + extension)
- File size limits
- Isolated temporary storage
- Automatic file cleanup
- Rate limiting (100 requests per 15 minutes)
- Input sanitization
- Secure headers (via Nginx)
- Optional JWT authentication

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Configure firewall (UFW or iptables)
- [ ] Enable HTTPS with SSL certificate (Let's Encrypt)
- [ ] Set up MongoDB authentication
- [ ] Configure regular backups
- [ ] Set up monitoring and alerts
- [ ] Review and adjust rate limits
- [ ] Configure log rotation

## 🌐 SSL/HTTPS Setup (Optional)

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
# Test renewal:
sudo certbot renew --dry-run
```

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check connection string in `.env`
- For remote MongoDB, ensure network access

### "Ghostscript command not found"
- Verify installation: `gs --version`
- Check path in `.env`: `GHOSTSCRIPT_PATH`

### "LibreOffice conversion failed"
- Verify installation: `libreoffice --version`
- Check path in `.env`: `LIBREOFFICE_PATH`
- Ensure headless mode is available

### "Upload fails with 413 error"
- Increase `client_max_body_size` in Nginx config
- Increase `MAX_FILE_SIZE` in `.env`

### "Files not being deleted automatically"
- Check cleanup cron logs: `pm2 logs docify-backend | grep cleanup`
- Verify `FILE_EXPIRY_MINUTES` in `.env`

## 📝 API Documentation

### Upload Files

```http
POST /api/upload
Content-Type: multipart/form-data

files: File[]
```

### Process Tool

```http
POST /api/process/{tool}
Content-Type: application/json

{
  "fileIds": ["file-id-1", "file-id-2"],
  "options": {}
}
```

### Get Job Status

```http
GET /api/jobs/{jobId}
```

### Download Result

```http
GET /api/jobs/{jobId}/download
```

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Inspired by iLovePDF.com
- Built with Next.js, Express, and PDF processing libraries
- UI components styled with Tailwind CSS
- Animations powered by Framer Motion

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact: support@docify.example.com

---

**Built with ❤️ for the PDF processing community**
