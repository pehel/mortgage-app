import React, { useState } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  TextField,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  LinearProgress,
} from '@mui/material';
import {
  AccountBalance,
  CreditCard,
  TrendingUp,
  Park,
  AccountBalanceWallet,
  CheckCircle,
  Schedule,
  Person,
  Description,
  Gavel,
  Payment,
  ArrowForward,
  CloudUpload,
  Autorenew,
  AutoAwesome,
  ArrowBack,
  Calculate,
  ChatBubbleOutline,
  Send,
  SmartToy
} from '@mui/icons-material';

// Add CSS animation for spinning icon
const spinKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Inject the CSS
const style = document.createElement('style');
style.textContent = spinKeyframes;
document.head.appendChild(style);

type ProductType =
  | 'personal_loan'
  | 'term_loan'
  | 'green_loan'
  | 'credit_card'
  | 'overdraft';

interface Product {
  id: ProductType;
  name: string;
  description: string;
  icon: React.ReactElement;
  color: string;
  features: string[];
  limits: string;
  interestRate?: string;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  isExistingCustomer: boolean;
}

interface ApplicationData {
  amount?: number;
  term?: number;
  annualIncome?: number;
  employmentType?: string;
  requestedLimit?: number;
  accountType?: string;
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestedProducts?: Product[];
}

function App() {
  const [currentStep, setCurrentStep] = useState(-1); // Start with -1 for AI chat
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [applicationData, setApplicationData] = useState<ApplicationData>({});
  const [documents, setDocuments] = useState<string[]>([]);
  const [applicationRef] = useState(
    `APP${Math.random().toString(36).substr(2, 10).toUpperCase()}`
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: "Hello! 👋 I'm your AI Banking Assistant. I'm here to help you find the perfect banking product for your needs. What are you looking for today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');

  const steps = [
    'AI Assistant',
    'Product Selection',
    'Customer Details',
    'Application Details',
    'Document Upload',
    'Review & Decision',
    'Agreement',
    'Completion',
  ];

  const handleBack = () => {
    if (currentStep > -1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const products: Product[] = [
    {
      id: 'personal_loan',
      name: 'Personal Loan',
      description: 'Quick personal loans up to €10,000 with instant approval',
      icon: <AccountBalance />,
      color: '#1976d2',
      features: [
        'Instant approval up to €10k',
        'No collateral required',
        'Flexible terms',
      ],
      limits: '€1,000 - €10,000',
      interestRate: '3.5% - 8.9%',
    },
    {
      id: 'term_loan',
      name: 'Term Loan',
      description: 'Long-term loans for major expenses with competitive rates',
      icon: <TrendingUp />,
      color: '#388e3c',
      features: ['Competitive rates', 'Extended terms', 'Large amounts'],
      limits: '€5,000 - €100,000',
      interestRate: '2.9% - 6.5%',
    },
    {
      id: 'green_loan',
      name: 'Green Loan',
      description: 'Eco-friendly financing for sustainable projects',
      icon: <Park />,
      color: '#2e7d32',
      features: [
        'Lower interest rates',
        'Environmental impact',
        'Government incentives',
      ],
      limits: '€2,000 - €50,000',
      interestRate: '2.5% - 5.9%',
    },
    {
      id: 'credit_card',
      name: 'Credit Card',
      description: 'Flexible credit cards with rewards and benefits',
      icon: <CreditCard />,
      color: '#7b1fa2',
      features: [
        'Contactless payments',
        'Cashback rewards',
        'Travel insurance',
      ],
      limits: '€500 - €15,000',
    },
    {
      id: 'overdraft',
      name: 'Overdraft',
      description: 'Flexible overdraft facility for your current account',
      icon: <AccountBalanceWallet />,
      color: '#f57c00',
      features: ['Instant access', 'Only pay when used', 'Flexible repayment'],
      limits: '€100 - €5,000',
    },
  ];

  const requiredDocuments = {
    personal_loan: ['Passport/ID', 'Bank Statement (3 months)', 'Income Proof'],
    term_loan: [
      'Passport/ID',
      'Bank Statement (6 months)',
      'Income Proof',
      'Address Proof',
    ],
    green_loan: [
      'Passport/ID',
      'Bank Statement (3 months)',
      'Income Proof',
      'Project Documentation',
    ],
    credit_card: [
      'Passport/ID',
      'Bank Statement (3 months)',
      'Income Proof',
      'Employment Letter',
    ],
    overdraft: ['Passport/ID', 'Bank Statement (6 months)', 'Account Details'],
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCurrentStep(1); // Skip to step 1 (Customer Details) since we're adding AI chat as step -1
  };

  const handleChatProductSelect = (product: Product) => {
    setSelectedProduct(product);
    // Add a message to show the selection
    const selectionMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `Great choice! You've selected ${product.name}. Let's start your application process.`,
      sender: 'bot',
      timestamp: new Date()
    };
    setChatMessages(prev => [...prev, selectionMessage]);
    
    // Navigate to customer details step after a short delay
    setTimeout(() => {
      setCurrentStep(1); // Go to customer details step
    }, 1500);
  };

  const generateBotResponse = (userMessage: string): { text: string; suggestedProducts?: Product[] } => {
    const message = userMessage.toLowerCase();
    
    // Loan-related keywords
    if (message.includes('loan') || message.includes('borrow') || message.includes('money') || message.includes('finance')) {
      if (message.includes('personal') || message.includes('quick') || message.includes('small')) {
        return {
          text: "I can help you with a Personal Loan! It's perfect for quick financing up to €10,000 with instant approval. Would you like to explore this option?",
          suggestedProducts: [products.find(p => p.id === 'personal_loan')!]
        };
      } else if (message.includes('long term') || message.includes('large') || message.includes('major')) {
        return {
          text: "A Term Loan sounds like what you need! It offers competitive rates for larger amounts up to €100,000 with extended repayment terms. Shall we look at this?",
          suggestedProducts: [products.find(p => p.id === 'term_loan')!]
        };
      } else if (message.includes('green') || message.includes('eco') || message.includes('sustainable') || message.includes('environment')) {
        return {
          text: "Excellent choice for the environment! Our Green Loan offers lower interest rates for sustainable projects. Let me show you the details:",
          suggestedProducts: [products.find(p => p.id === 'green_loan')!]
        };
      } else {
        return {
          text: "I can help you with different types of loans! Here are our loan options:",
          suggestedProducts: products.filter(p => p.id.includes('loan'))
        };
      }
    }
    
    // Credit card keywords
    else if (message.includes('credit card') || message.includes('card') || message.includes('credit')) {
      return {
        text: "Our Credit Cards come with great rewards and benefits! Contactless payments, cashback rewards, and travel insurance. Would you like to apply?",
        suggestedProducts: [products.find(p => p.id === 'credit_card')!]
      };
    }
    
    // Overdraft keywords
    else if (message.includes('overdraft') || message.includes('account') || message.includes('flexible')) {
      return {
        text: "An Overdraft facility gives you instant access to funds when you need them. You only pay interest when you use it. Interested?",
        suggestedProducts: [products.find(p => p.id === 'overdraft')!]
      };
    }
    
    // General inquiry
    else if (message.includes('help') || message.includes('options') || message.includes('products') || message.includes('what')) {
      return {
        text: "I can help you with all our banking products! Here's what we offer:",
        suggestedProducts: products
      };
    }
    
    // Default response
    else {
      return {
        text: "I'd be happy to help you find the right banking product! Could you tell me more about what you're looking for? For example, are you interested in a loan, credit card, or overdraft facility?",
      };
    }
  };

  const handleSendMessage = () => {
    if (!currentMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    const botResponse = generateBotResponse(currentMessage);
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: botResponse.text,
      sender: 'bot',
      timestamp: new Date(),
      suggestedProducts: botResponse.suggestedProducts
    };

    setChatMessages(prev => [...prev, userMessage, botMessage]);
    setCurrentMessage('');
  };

  const handleCustomerSubmit = (data: CustomerData) => {
    setCustomerData(data);
    setCurrentStep(2);
  };

  const handleApplicationSubmit = (data: ApplicationData) => {
    setApplicationData(data);
    setCurrentStep(3);
  };

  const handleDocumentsSubmit = (docs: string[]) => {
    setDocuments(docs);
    setCurrentStep(4);
  };

  const handleDecision = (approved: boolean) => {
    if (approved) {
      setCurrentStep(5);
    } else {
      // Handle rejection
      alert('Application denied. Please contact our support team.');
    }
  };

  const handleAgreementSign = () => {
    setCurrentStep(6);
  };

  return (
    <Container maxWidth="lg">
      <AppBar position="static" sx={{ mb: 3 }}>
        <Toolbar>
          <AccountBalance sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            AIBanking
          </Typography>
          <Chip
            label={`Step ${currentStep + 1} of ${steps.length}`}
            color="secondary"
            variant="outlined"
          />
        </Toolbar>
      </AppBar>

      <Stepper activeStep={currentStep + 1} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      {/* Step -1: AI Assistant Chat */}
      {currentStep === -1 && (
        <AIChatInterface 
          messages={chatMessages}
          currentMessage={currentMessage}
          onMessageChange={setCurrentMessage}
          onSendMessage={handleSendMessage}
          onProductSelect={handleChatProductSelect}
          onProceedToProducts={() => setCurrentStep(0)}
        />
      )}

      {/* Step 0: Product Selection */}
      {currentStep === 0 && (
        <Box>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
            >
              Back to AI Assistant
            </Button>
          </Box>
          <Typography variant="h4" gutterBottom textAlign="center">
            Welcome to AI Banking Assistant
          </Typography>
          <Typography
            variant="h6"
            gutterBottom
            textAlign="center"
            color="text.secondary"
          >
            What banking product are you interested in today?
          </Typography>

          <Grid container spacing={3} sx={{ mt: 3 }}>
            {products.map((product) => (
              <Grid item xs={12} md={6} lg={4} key={product.id}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                  onClick={() => handleProductSelect(product)}
                >
                  <CardContent>
                    <Box display="flex" alignItems="center" gap={2} mb={2}>
                      <Box sx={{ color: product.color, fontSize: 40 }}>
                        {product.icon}
                      </Box>
                      <Typography variant="h6">{product.name}</Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      paragraph
                    >
                      {product.description}
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" gutterBottom>
                      {product.limits}
                    </Typography>
                    {product.interestRate && (
                      <Typography variant="body2" color="primary" gutterBottom>
                        Interest: {product.interestRate}
                      </Typography>
                    )}
                    <List dense>
                      {product.features.map((feature, index) => (
                        <ListItem key={index} sx={{ px: 0 }}>
                          <ListItemIcon sx={{ minWidth: 30 }}>
                            <CheckCircle color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={feature} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  <CardActions>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ bgcolor: product.color }}
                      endIcon={<ArrowForward />}
                    >
                      Select {product.name}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Step 1: Customer Details */}
      {currentStep === 1 && selectedProduct && (
        <Box>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
            >
              Back to Product Selection
            </Button>
          </Box>
          <CustomerDetailsForm
            product={selectedProduct}
            onSubmit={handleCustomerSubmit}
          />
        </Box>
      )}

      {/* Step 2: Application Details */}
      {currentStep === 2 && selectedProduct && (
        <Box>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
            >
              Back to Customer Details
            </Button>
          </Box>
          <ApplicationDetailsForm
            product={selectedProduct}
            onSubmit={handleApplicationSubmit}
          />
        </Box>
      )}

      {/* Step 3: Document Upload */}
      {currentStep === 3 && selectedProduct && (
        <Box>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
            >
              Back to Application Details
            </Button>
          </Box>
          <DocumentUploadStep
            product={selectedProduct}
            requiredDocs={requiredDocuments[selectedProduct.id]}
            onSubmit={handleDocumentsSubmit}
          />
        </Box>
      )}

      {/* Step 4: Review & Decision */}
      {currentStep === 4 && (
        <Box>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
            >
              Back to Document Upload
            </Button>
          </Box>
          <ReviewDecisionStep
            product={selectedProduct!}
            customer={customerData!}
            application={applicationData}
            documents={documents}
            applicationRef={applicationRef}
            onDecision={handleDecision}
          />
        </Box>
      )}

      {/* Step 5: Agreement */}
      {currentStep === 5 && (
        <Box>
          <Box display="flex" alignItems="center" gap={2} mb={3}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
            >
              Back to Review
            </Button>
          </Box>
          <AgreementStep
            product={selectedProduct!}
            applicationRef={applicationRef}
            onSign={handleAgreementSign}
          />
        </Box>
      )}

      {/* Step 6: Completion */}
      {currentStep === 6 && (
        <CompletionStep
          product={selectedProduct!}
          applicationRef={applicationRef}
        />
      )}
    </Container>
  );
}

// Customer Details Form Component
function CustomerDetailsForm({
  product,
  onSubmit,
}: {
  product: Product;
  onSubmit: (data: CustomerData) => void;
}) {
  const [formData, setFormData] = useState<CustomerData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    isExistingCustomer: false,
  });

  const [uploadMethod, setUploadMethod] = useState<'manual' | 'bankStatement'>(
    'manual'
  );
  const [isExtracting, setIsExtracting] = useState(false);

  const handleBankStatementUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsExtracting(true);
      // Simulate bank statement processing
      setTimeout(() => {
        // Simulate extracted data from bank statement
        setFormData({
          firstName: 'Rajat',
          lastName: 'Maheshwari',
          email: 'rajat.m@email.com',
          phone: '+353 89 123 4567',
          dateOfBirth: '1984-03-01',
          address: '123 Grafton Street, Dublin 2, Ireland',
          isExistingCustomer: false,
        });
        setIsExtracting(false);
      }, 2000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Person color="primary" />
        <Typography variant="h5">Customer Details</Typography>
      </Box>
      <Alert severity="info" sx={{ mb: 3 }}>
        You've selected: <strong>{product.name}</strong>. Please provide your
        details to continue.
      </Alert>

      {/* Data Input Method Selection */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          How would you like to provide your information?
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                cursor: 'pointer',
                border:
                  uploadMethod === 'manual'
                    ? '2px solid #1976d2'
                    : '1px solid #e0e0e0',
                '&:hover': { borderColor: '#1976d2' },
              }}
              onClick={() => setUploadMethod('manual')}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <Person sx={{ fontSize: 40, color: '#1976d2', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Manual Entry
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Fill in your details manually using the form below
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                cursor: 'pointer',
                border:
                  uploadMethod === 'bankStatement'
                    ? '2px solid #1976d2'
                    : '1px solid #e0e0e0',
                '&:hover': { borderColor: '#1976d2' },
              }}
              onClick={() => setUploadMethod('bankStatement')}
            >
              <CardContent sx={{ textAlign: 'center', py: 3 }}>
                <AutoAwesome sx={{ fontSize: 40, color: '#1976d2', mb: 2 }} />
                <Typography variant="h6" gutterBottom>
                  Bank Statement Upload
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Upload your bank statement and we'll extract your details
                  automatically
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Bank Statement Upload Section */}
      {uploadMethod === 'bankStatement' && (
        <Box sx={{ mb: 4 }}>
          <Alert severity="success" sx={{ mb: 2 }}>
            <strong>Smart Data Extraction:</strong> Upload your bank statement
            (PDF) and our we will extract your personal information.
          </Alert>

          <input
            accept=".pdf,.jpg,.jpeg,.png"
            style={{ display: 'none' }}
            id="bank-statement-upload"
            type="file"
            onChange={handleBankStatementUpload}
          />
          <label htmlFor="bank-statement-upload">
            <Button
              variant="outlined"
              component="span"
              fullWidth
              startIcon={
                isExtracting ? (
                  <Autorenew sx={{ animation: 'spin 1s linear infinite' }} />
                ) : (
                  <CloudUpload />
                )
              }
              disabled={isExtracting}
              sx={{ py: 2, mb: 2 }}
            >
              {isExtracting
                ? 'Extracting Information...'
                : 'Upload Bank Statement (PDF, JPG, PNG)'}
            </Button>
          </label>

          {isExtracting && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Processing your bank statement...
              </Typography>
              <LinearProgress />
            </Box>
          )}
        </Box>
      )}

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, firstName: e.target.value }))
              }
              required
              InputProps={{
                readOnly:
                  uploadMethod === 'bankStatement' && !!formData.firstName,
              }}
              sx={{
                '& .MuiInputBase-input': {
                  backgroundColor:
                    uploadMethod === 'bankStatement' && !!formData.firstName
                      ? '#f5f5f5'
                      : 'transparent',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, lastName: e.target.value }))
              }
              required
              InputProps={{
                readOnly:
                  uploadMethod === 'bankStatement' && !!formData.lastName,
              }}
              sx={{
                '& .MuiInputBase-input': {
                  backgroundColor:
                    uploadMethod === 'bankStatement' && !!formData.lastName
                      ? '#f5f5f5'
                      : 'transparent',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              required
              InputProps={{
                readOnly: uploadMethod === 'bankStatement' && !!formData.email,
              }}
              sx={{
                '& .MuiInputBase-input': {
                  backgroundColor:
                    uploadMethod === 'bankStatement' && !!formData.email
                      ? '#f5f5f5'
                      : 'transparent',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
              required
              InputProps={{
                readOnly: uploadMethod === 'bankStatement' && !!formData.phone,
              }}
              sx={{
                '& .MuiInputBase-input': {
                  backgroundColor:
                    uploadMethod === 'bankStatement' && !!formData.phone
                      ? '#f5f5f5'
                      : 'transparent',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  dateOfBirth: e.target.value,
                }))
              }
              InputLabelProps={{ shrink: true }}
              required
              InputProps={{
                readOnly:
                  uploadMethod === 'bankStatement' && !!formData.dateOfBirth,
              }}
              sx={{
                '& .MuiInputBase-input': {
                  backgroundColor:
                    uploadMethod === 'bankStatement' && !!formData.dateOfBirth
                      ? '#f5f5f5'
                      : 'transparent',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Customer Type</InputLabel>
              <Select
                value={formData.isExistingCustomer ? 'existing' : 'new'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isExistingCustomer: e.target.value === 'existing',
                  }))
                }
              >
                <MenuItem value="new">New Customer</MenuItem>
                <MenuItem value="existing">Existing Customer</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              multiline
              rows={3}
              value={formData.address}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, address: e.target.value }))
              }
              required
              InputProps={{
                readOnly:
                  uploadMethod === 'bankStatement' && !!formData.address,
              }}
              sx={{
                '& .MuiInputBase-input': {
                  backgroundColor:
                    uploadMethod === 'bankStatement' && !!formData.address
                      ? '#f5f5f5'
                      : 'transparent',
                },
              }}
            />
          </Grid>

          {/* Show success message when data is extracted */}
          {uploadMethod === 'bankStatement' && formData.firstName && (
            <Grid item xs={12}>
              <Alert severity="success" sx={{ mb: 2 }}>
                <strong>Information Extracted Successfully!</strong> Your
                details have been automatically filled from the bank statement.
                Please review and modify if needed.
              </Alert>
            </Grid>
          )}

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              endIcon={<ArrowForward />}
            >
              Continue to Application Details
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

// Application Details Form Component
function ApplicationDetailsForm({
  product,
  onSubmit,
}: {
  product: Product;
  onSubmit: (data: ApplicationData) => void;
}) {
  const [formData, setFormData] = useState<ApplicationData>({});
  const [showCalculation, setShowCalculation] = useState(false);

  const calculateLoanDetails = () => {
    if (!formData.amount || !formData.term) return null;

    const principal = formData.amount;
    const rate =
      product.id === 'green_loan'
        ? 3.8
        : product.id === 'term_loan'
        ? 4.2
        : 5.5;
    const months = formData.term;

    const monthlyRate = rate / 100 / 12;
    const monthlyPayment =
      (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
      (Math.pow(1 + monthlyRate, months) - 1);
    const totalAmount = monthlyPayment * months;
    const totalInterest = totalAmount - principal;

    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalAmount: Math.round(totalAmount * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      interestRate: rate,
    };
  };

  const calculation = calculateLoanDetails();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        {product.icon}
        <Typography variant="h5">{product.name} Application</Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Loan Products */}
          {product.id.includes('loan') && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Loan Amount (€)"
                  type="number"
                  value={formData.amount || ''}
                  onChange={(e) => {
                    const amount = parseFloat(e.target.value);
                    setFormData((prev) => ({ ...prev, amount }));
                    if (formData.term && amount) {
                      setShowCalculation(true);
                    }
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Term (months)"
                  type="number"
                  value={formData.term || ''}
                  onChange={(e) => {
                    const term = parseInt(e.target.value);
                    setFormData((prev) => ({ ...prev, term }));
                    if (formData.amount && term) {
                      setShowCalculation(true);
                    }
                  }}
                  required
                />
              </Grid>

              {/* Inline Calculation Display */}
              {showCalculation && calculation && (
                <Grid item xs={12}>
                  <Card
                    variant="outlined"
                    sx={{
                      bgcolor: '#f8f9fa',
                      border: '2px solid #e3f2fd',
                      mt: 2,
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={2} mb={2}>
                        <Calculate color="primary" />
                        <Typography variant="h6" color="primary">
                          Loan Calculation
                        </Typography>
                      </Box>

                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6} md={3}>
                          <Box textAlign="center" p={2}>
                            <Typography
                              variant="h4"
                              color="primary"
                              fontWeight="bold"
                            >
                              €{calculation.monthlyPayment}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Monthly Payment
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Box textAlign="center" p={2}>
                            <Typography variant="h5" fontWeight="bold">
                              €{calculation.totalAmount.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Amount
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Box textAlign="center" p={2}>
                            <Typography variant="h5" fontWeight="bold">
                              €{calculation.totalInterest.toLocaleString()}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Total Interest
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3}>
                          <Box textAlign="center" p={2}>
                            <Typography variant="h5" fontWeight="bold">
                              {calculation.interestRate}%
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Interest Rate
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>

                      <Alert severity="info" sx={{ mt: 2 }}>
                        <strong>Loan Summary:</strong> €
                        {formData.amount?.toLocaleString()} over {formData.term}{' '}
                        months at {calculation.interestRate}% interest rate
                      </Alert>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </>
          )}

          {/* Credit Card */}
          {product.id === 'credit_card' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Annual Income (€)"
                  type="number"
                  value={formData.annualIncome || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      annualIncome: parseFloat(e.target.value),
                    }))
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Employment Type</InputLabel>
                  <Select
                    value={formData.employmentType || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        employmentType: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="full_time">Full Time</MenuItem>
                    <MenuItem value="part_time">Part Time</MenuItem>
                    <MenuItem value="self_employed">Self Employed</MenuItem>
                    <MenuItem value="retired">Retired</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {formData.annualIncome && (
                <Grid item xs={12}>
                  <Alert severity="info">
                    Estimated Credit Limit: €
                    {Math.min(
                      formData.annualIncome * 0.3,
                      15000
                    ).toLocaleString()}
                  </Alert>
                </Grid>
              )}
            </>
          )}

          {/* Overdraft */}
          {product.id === 'overdraft' && (
            <>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Requested Limit (€)"
                  type="number"
                  value={formData.requestedLimit || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      requestedLimit: parseFloat(e.target.value),
                    }))
                  }
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Account Type</InputLabel>
                  <Select
                    value={formData.accountType || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        accountType: e.target.value,
                      }))
                    }
                  >
                    <MenuItem value="current">Current Account</MenuItem>
                    <MenuItem value="savings">Savings Account</MenuItem>
                    <MenuItem value="business">Business Account</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </>
          )}

          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              endIcon={<ArrowForward />}
            >
              Continue to Document Upload
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
}

// Document Upload Step Component
function DocumentUploadStep({
  product,
  requiredDocs,
  onSubmit,
}: {
  product: Product;
  requiredDocs: string[];
  onSubmit: (docs: string[]) => void;
}) {
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([]);

  const handleDocUpload = (doc: string) => {
    if (!uploadedDocs.includes(doc)) {
      setUploadedDocs((prev) => [...prev, doc]);
    }
  };

  const handleSubmit = () => {
    onSubmit(uploadedDocs);
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Description color="primary" />
        <Typography variant="h5">Document Upload</Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Please upload the following documents for your {product.name}{' '}
        application:
      </Alert>

      <Grid container spacing={2}>
        {requiredDocs.map((doc) => (
          <Grid item xs={12} md={6} key={doc}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {doc}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Required for verification
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant={
                    uploadedDocs.includes(doc) ? 'contained' : 'outlined'
                  }
                  color={uploadedDocs.includes(doc) ? 'success' : 'primary'}
                  onClick={() => handleDocUpload(doc)}
                  startIcon={
                    uploadedDocs.includes(doc) ? <CheckCircle /> : null
                  }
                >
                  {uploadedDocs.includes(doc) ? 'Uploaded' : 'Upload'}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <LinearProgress
          variant="determinate"
          value={(uploadedDocs.length / requiredDocs.length) * 100}
          sx={{ mb: 2 }}
        />
        <Typography variant="body2" textAlign="center" gutterBottom>
          {uploadedDocs.length} of {requiredDocs.length} documents uploaded
        </Typography>

        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={uploadedDocs.length < requiredDocs.length}
          onClick={handleSubmit}
          endIcon={<ArrowForward />}
        >
          Continue to Review
        </Button>
      </Box>
    </Paper>
  );
}

// Review & Decision Step Component
function ReviewDecisionStep({
  product,
  customer,
  application,
  documents,
  applicationRef,
  onDecision,
}: {
  product: Product;
  customer: CustomerData;
  application: ApplicationData;
  documents: string[];
  applicationRef: string;
  onDecision: (approved: boolean) => void;
}) {
  const [processing, setProcessing] = useState(false);
  const [decision, setDecision] = useState<'approved' | 'denied' | null>(null);

  const handleReview = () => {
    setProcessing(true);

    // Simulate AI decision making
    setTimeout(() => {
      // Simple decision logic for demo - always approve existing customers
      const isApproved = customer.isExistingCustomer ? true : Math.random() > 0.3;

      setDecision(isApproved ? 'approved' : 'denied');
      setProcessing(false);

      setTimeout(() => {
        onDecision(isApproved);
      }, 2000);
    }, 3000);
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Gavel color="primary" />
        <Typography variant="h5">Application Review</Typography>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Application Reference: <strong>{applicationRef}</strong>
      </Alert>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Customer Information
              </Typography>
              <Typography variant="body2">
                <strong>Name:</strong> {customer.firstName} {customer.lastName}
              </Typography>
              <Typography variant="body2">
                <strong>Email:</strong> {customer.email}
              </Typography>
              <Typography variant="body2">
                <strong>Customer Type:</strong>{' '}
                {customer.isExistingCustomer ? 'Existing' : 'New'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Product Details
              </Typography>
              <Typography variant="body2">
                <strong>Product:</strong> {product.name}
              </Typography>
              {application.amount && (
                <Typography variant="body2">
                  <strong>Amount:</strong> €
                  {application.amount.toLocaleString()}
                </Typography>
              )}
              {application.term && (
                <Typography variant="body2">
                  <strong>Term:</strong> {application.term} months
                </Typography>
              )}
              {application.annualIncome && (
                <Typography variant="body2">
                  <strong>Annual Income:</strong> €
                  {application.annualIncome.toLocaleString()}
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Documents Submitted
              </Typography>
              <List>
                {documents.map((doc) => (
                  <ListItem key={doc}>
                    <ListItemIcon>
                      <CheckCircle color="success" />
                    </ListItemIcon>
                    <ListItemText primary={doc} secondary="Verified" />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          {!processing && !decision && (
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleReview}
              startIcon={<Gavel />}
            >
              Process Application
            </Button>
          )}

          {processing && (
            <Box textAlign="center">
              <LinearProgress sx={{ mb: 2 }} />
              <Typography variant="body1">
                We are reviewing your application...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Analyzing credit profile, documents, and eligibility criteria
              </Typography>
            </Box>
          )}

          {decision === 'approved' && (
            <Alert severity="success" sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                🎉 Congratulations! Your application has been APPROVED!
              </Typography>
              <Typography variant="body1">
                Proceeding to agreement signing...
              </Typography>
            </Alert>
          )}

          {decision === 'denied' && (
            <Alert severity="error" sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Application Decision: DENIED
              </Typography>
              <Typography variant="body1">
                Unfortunately, we cannot approve your application at this time.
              </Typography>
            </Alert>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

// Agreement Step Component
function AgreementStep({
  product,
  applicationRef,
  onSign,
}: {
  product: Product;
  applicationRef: string;
  onSign: () => void;
}) {
  const [agreed, setAgreed] = useState(false);
  const [signing, setSigning] = useState(false);

  const handleSign = () => {
    setSigning(true);
    setTimeout(() => {
      onSign();
    }, 2000);
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <Description color="primary" />
        <Typography variant="h5">Credit Agreement</Typography>
      </Box>

      <Alert severity="success" sx={{ mb: 3 }}>
        Your {product.name} application has been approved! Please review and
        sign the agreement.
      </Alert>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Credit Agreement Terms
          </Typography>
          <Typography variant="body2" paragraph>
            This agreement is for your approved {product.name} with reference{' '}
            {applicationRef}.
          </Typography>
          <Typography variant="body2" paragraph>
            By signing this agreement, you acknowledge that you have read and
            understood all terms and conditions.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography variant="body2" fontWeight="bold">
            Key Terms:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText primary={`Product: ${product.name}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Interest Rate: As per approved rate" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Repayment: Monthly installments" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Early repayment: Allowed without penalty" />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Box mb={3}>
        <Button
          variant="outlined"
          onClick={() => setAgreed(!agreed)}
          startIcon={agreed ? <CheckCircle color="success" /> : null}
          fullWidth
        >
          {agreed
            ? 'Agreement Accepted'
            : 'I agree to the terms and conditions'}
        </Button>
      </Box>

      {!signing ? (
        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={!agreed}
          onClick={handleSign}
          startIcon={<Payment />}
        >
          Sign Agreement (DocuSign)
        </Button>
      ) : (
        <Box textAlign="center">
          <LinearProgress sx={{ mb: 2 }} />
          <Typography variant="body1">
            Processing digital signature...
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

// Completion Step Component
function CompletionStep({
  product,
  applicationRef,
}: {
  product: Product;
  applicationRef: string;
}) {
  const getBookingMessage = () => {
    switch (product.id) {
      case 'personal_loan':
      case 'term_loan':
      case 'green_loan':
        return 'Your loan funds will be disbursed to your account within 2 business days.';
      case 'credit_card':
        return 'Your credit card will be produced and delivered within 5-7 business days.';
      case 'overdraft':
        return 'Your overdraft facility has been activated and is available immediately.';
      default:
        return 'Your product will be activated shortly.';
    }
  };

  return (
    <Paper sx={{ p: 4, textAlign: 'center' }}>
      <CheckCircle color="success" sx={{ fontSize: 80, mb: 3 }} />

      <Typography variant="h4" gutterBottom color="success.main">
        Application Complete!
      </Typography>

      <Typography variant="h6" gutterBottom>
        Reference: {applicationRef}
      </Typography>

      <Alert severity="success" sx={{ mb: 3 }}>
        <Typography variant="body1" gutterBottom>
          Congratulations! Your {product.name} application has been successfully
          processed.
        </Typography>
        <Typography variant="body2">{getBookingMessage()}</Typography>
      </Alert>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Next Steps
          </Typography>
          <List>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary="Application approved and processed" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircle color="success" />
              </ListItemIcon>
              <ListItemText primary="Agreement signed digitally" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <Schedule color="primary" />
              </ListItemIcon>
              <ListItemText
                primary={
                  product.id === 'overdraft'
                    ? 'Facility activated'
                    : 'Processing disbursement/delivery'
                }
              />
            </ListItem>
          </List>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        size="large"
        onClick={() => window.location.reload()}
      >
        Start New Application
      </Button>
    </Paper>
  );
}

// AI Chat Interface Component
function AIChatInterface({ 
  messages, 
  currentMessage, 
  onMessageChange, 
  onSendMessage, 
  onProductSelect, 
  onProceedToProducts 
}: { 
  messages: ChatMessage[], 
  currentMessage: string, 
  onMessageChange: (message: string) => void, 
  onSendMessage: () => void, 
  onProductSelect: (product: Product) => void, 
  onProceedToProducts: () => void 
}) {
  return (
    <Paper sx={{ p: 4, maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        <SmartToy color="primary" sx={{ fontSize: 32 }} />
        <Typography variant="h5">AI Banking Assistant</Typography>
        <Chip label="Live Chat" color="success" size="small" />
      </Box>

      {/* Chat Messages */}
      <Box sx={{ 
        flexGrow: 1, 
        overflowY: 'auto', 
        mb: 3, 
        border: '1px solid #e0e0e0', 
        borderRadius: 2, 
        p: 2,
        maxHeight: '400px'
      }}>
        {messages.map((message) => (
          <Box key={message.id} sx={{ mb: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                mb: 1
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  bgcolor: message.sender === 'user' ? '#1976d2' : '#f5f5f5',
                  color: message.sender === 'user' ? 'white' : 'black',
                  borderRadius: message.sender === 'user' ? '20px 20px 5px 20px' : '20px 20px 20px 5px'
                }}
              >
                <Typography variant="body1">{message.text}</Typography>
              </Paper>
            </Box>

            {/* Product Suggestions */}
            {message.suggestedProducts && message.suggestedProducts.length > 0 && (
              <Box sx={{ ml: message.sender === 'bot' ? 0 : 'auto', maxWidth: '80%' }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Recommended products:
                </Typography>
                <Grid container spacing={1}>
                  {message.suggestedProducts.map((product) => (
                    <Grid item xs={12} sm={6} key={product.id}>
                      <Card 
                        sx={{ 
                          cursor: 'pointer',
                          border: '1px solid #e0e0e0',
                          '&:hover': { 
                            borderColor: product.color,
                            transform: 'translateY(-2px)',
                            transition: 'all 0.2s'
                          }
                        }}
                        onClick={() => onProductSelect(product)}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Box sx={{ color: product.color, fontSize: 24 }}>
                              {product.icon}
                            </Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {product.name}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary" fontSize="0.8rem">
                            {product.limits}
                          </Typography>
                          {product.interestRate && (
                            <Typography variant="body2" color="primary" fontSize="0.8rem">
                              {product.interestRate}
                            </Typography>
                          )}
                        </CardContent>
                        <CardActions sx={{ p: 1 }}>
                          <Button size="small" sx={{ fontSize: '0.7rem' }}>
                            Select This Product
                          </Button>
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {/* Message Input */}
      <Box display="flex" gap={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type your message here..."
          value={currentMessage}
          onChange={(e) => onMessageChange(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSendMessage();
            }
          }}
        />
        <Button
          variant="contained"
          onClick={onSendMessage}
          disabled={!currentMessage.trim()}
          startIcon={<Send />}
        >
          Send
        </Button>
      </Box>

      {/* Quick Actions */}
      <Box display="flex" gap={2} mt={3} justifyContent="center">
        <Button
          variant="outlined"
          startIcon={<ChatBubbleOutline />}
          onClick={onProceedToProducts}
        >
          Browse All Products
        </Button>
        <Button
          variant="text"
          onClick={() => onMessageChange("I need help choosing a product")}
        >
          Need Help Choosing?
        </Button>
      </Box>
    </Paper>
  );
}

export default App;
