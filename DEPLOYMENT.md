# Backend Deployment Guide for Vercel

## Required Environment Variables

You must set these environment variables in your Vercel dashboard:

### 1. Database
- `MONGO_URL` - Your MongoDB Atlas connection string
  - Format: `mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority`

### 2. Authentication
- `JWT_SECRET` - Secret key for JWT token generation
  - Generate a strong random string (at least 32 characters)

### 3. Admin Access
- `ADMIN_KEY` - Secret key for admin authentication
  - Generate a strong random string

### 4. Payment Integration (Razorpay)
- `RAZORPAY_API_KEY` - Your Razorpay API key
- `RAZORPAY_API_SECRET` - Your Razorpay API secret

### 5. Email Configuration (for password reset)
- `EMAIL` - Your email address (Gmail recommended)
- `EMAIL_PASSWORD` - Your email app password (not regular password)
- `FORGOT_PASSWORD` - Frontend URL for password reset
  - Format: `https://your-frontend-domain.vercel.app/reset-password`

## How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your backend project
3. Go to **Settings** → **Environment Variables**
4. Add each variable with the correct name and value
5. Click **Save**
6. Redeploy your project

## Testing Your Deployment

After deployment, test these endpoints:

- **Root URL**: `https://your-backend.vercel.app/`
- **Health Check**: `https://your-backend.vercel.app/health`
- **API Endpoints**: `https://your-backend.vercel.app/api/auth/getuser`

## Common Issues

1. **"Cannot GET /"** - This is normal, try `/health` or `/api/auth/getuser`
2. **MongoDB Connection Error** - Check your `MONGO_URL` is correct
3. **JWT Errors** - Ensure `JWT_SECRET` is set
4. **CORS Errors** - Frontend URL is already configured in the code

## Deployment Commands

```bash
# Deploy to Vercel
vercel --prod

# View deployment logs
vercel logs

# Check deployment status
vercel ls
```

## Frontend Configuration

Update your frontend environment variables to point to your deployed backend:

```
REACT_APP_FETCH_PRODUCT=https://your-backend.vercel.app/api/product
REACT_APP_ADMIN_UPDATE_PRODUCT=https://your-backend.vercel.app/api/admin/update-product
REACT_APP_ADMIN_DELETE_PRODUCT=https://your-backend.vercel.app/api/admin/delete-product
REACT_APP_GET_USER_DETAILS=https://your-backend.vercel.app/api/auth/getuser
REACT_APP_UPDATE_USER_DETAILS=https://your-backend.vercel.app/api/auth/updateuser
REACT_APP_RESET_PASSWORD=https://your-backend.vercel.app/api/auth/reset-password
REACT_APP_DELETE_USER_DETAILS=https://your-backend.vercel.app/api/auth/delete
``` 