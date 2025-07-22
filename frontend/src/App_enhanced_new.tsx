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
  Grid,
  Chip,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  CircularProgress,
  IconButton,
} from '@mui/material';
import {
  AccountBalance,
  CreditCard,
  TrendingUp,
  Park,
  AccountBalanceWallet,
  CheckCircle,
  Person,
  ArrowBack,
  Calculate,
  Send,
  SmartToy,
  Groups,
  VerifiedUser,
  Email,
  UploadFile,
  Cancel,
  Assignment,
  ArrowForward,
} from '@mui/icons-material';

// Add CSS animations and modern styling
const spinKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes fadeIn {
  0% { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

@keyframes slideInRight {
  0% { opacity: 0; transform: translateX(30px); }
  100% { opacity: 1; transform: translateX(0); }
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.fade-in {
  animation: fadeIn 0.6s ease-out;
}

.slide-in-right {
  animation: slideInRight 0.5s ease-out;
}

.pulse-animation {
  animation: pulse 2s infinite;
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
  maxAmount?: string;
}

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  employmentStatus: string;
  employer: string;
  annualIncome: string;
  monthlyIncome?: string;
  monthlyExpenses?: string;
  existingDebts?: string;
  isJoint?: boolean;
  jointApplicant?: CustomerData;
}

interface ApplicationData {
  loanAmount: string;
  loanPurpose: string;
  employmentLength: string;
  monthlyIncome: string;
  monthlyExpenses: string;
  existingDebts: string;
  creditScore: string;
  collateral: string;
  isJoint?: boolean;
  applicationType?: string;
}

interface ChatMessage {
  id?: string;
  role?: 'user' | 'assistant';
  content?: string;
  text?: string;
  sender?: 'user' | 'bot';
  timestamp?: Date;
  suggestedProducts?: Product[];
}

function App() {
  const [currentStep, setCurrentStep] = useState(-1); // Start with -1 for AI chat
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [applicationData, setApplicationData] = useState<ApplicationData>({
    loanAmount: '',
    loanPurpose: '',
    employmentLength: '',
    monthlyIncome: '',
    monthlyExpenses: '',
    existingDebts: '',
    creditScore: '',
    collateral: '',
  });
  const [documents, setDocuments] = useState<string[]>([]);
  const [jointDocuments, setJointDocuments] = useState<string[]>([]);
  const [applicationRef] = useState(
    `APP${Math.random().toString(36).substr(2, 10).toUpperCase()}`
  );
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hello! 👋 I'm your Banking Assistant. I'm here to help you find the banking product for your needs. What are you looking for today?",
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState('');

  const steps = [
    'AI Assistant',
    'Product Selection',
    'Customer Details',
    'Application Details',
    'Document Upload',
    'Joint Verification',
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
      maxAmount: '€10,000',
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
      maxAmount: '€100,000',
      interestRate: '2.9% - 6.5%',
    },
    {
      id: 'green_loan',
      name: 'Green Loan',
      description: 'Eco-friendly financing for sustainable projects',
      icon: <Park />,
      color: '#2e7d32',
      features: ['Lower APR', 'Environmental impact', 'Government incentives'],
      limits: '€2,000 - €50,000',
      maxAmount: '€50,000',
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
      maxAmount: '€15,000',
    },
    {
      id: 'overdraft',
      name: 'Overdraft',
      description: 'Flexible overdraft facility for your current account',
      icon: <AccountBalanceWallet />,
      color: '#f57c00',
      features: ['Instant access', 'Only pay when used', 'Flexible repayment'],
      limits: '€100 - €5,000',
      maxAmount: '€5,000',
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
    setCurrentStep(1);
  };

  const handleChatProductSelect = (product: Product) => {
    setSelectedProduct(product);
    const selectionMessage: ChatMessage = {
      id: Date.now().toString(),
      text: `Great choice! You've selected ${product.name}. Let's start your application process.`,
      sender: 'bot',
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, selectionMessage]);

    setTimeout(() => {
      setCurrentStep(1);
    }, 1500);
  };

  const generateBotResponse = (
    userMessage: string
  ): { text: string; suggestedProducts?: Product[] } => {
    const message = userMessage.toLowerCase();

    if (
      message.includes('loan') ||
      message.includes('borrow') ||
      message.includes('money') ||
      message.includes('finance')
    ) {
      if (
        message.includes('personal') ||
        message.includes('quick') ||
        message.includes('small')
      ) {
        return {
          text: "I can help you with a Personal Loan! It's perfect for quick financing up to €10,000 with instant approval. Would you like to explore this option?",
          suggestedProducts: [products.find((p) => p.id === 'personal_loan')!],
        };
      } else if (
        message.includes('long term') ||
        message.includes('large') ||
        message.includes('major')
      ) {
        return {
          text: 'A Term Loan sounds like what you need! It offers competitive rates for larger amounts up to €100,000 with extended repayment terms. Shall we look at this?',
          suggestedProducts: [products.find((p) => p.id === 'term_loan')!],
        };
      } else if (
        message.includes('green') ||
        message.includes('eco') ||
        message.includes('sustainable') ||
        message.includes('environment')
      ) {
        return {
          text: 'Excellent choice for the environment! Our Green Loan offers lower APR for sustainable projects. Let me show you the details:',
          suggestedProducts: [products.find((p) => p.id === 'green_loan')!],
        };
      } else {
        return {
          text: 'I can help you with different types of loans! Here are our loan options:',
          suggestedProducts: products.filter((p) => p.id.includes('loan')),
        };
      }
    } else if (
      message.includes('credit card') ||
      message.includes('card') ||
      message.includes('credit')
    ) {
      return {
        text: 'Our Credit Cards come with great rewards and benefits! Contactless payments, cashback rewards, and travel insurance. Would you like to apply?',
        suggestedProducts: [products.find((p) => p.id === 'credit_card')!],
      };
    } else if (
      message.includes('overdraft') ||
      message.includes('account') ||
      message.includes('flexible')
    ) {
      return {
        text: 'An Overdraft facility gives you instant access to funds when you need them. You only pay interest when you use it. Interested?',
        suggestedProducts: [products.find((p) => p.id === 'overdraft')!],
      };
    } else if (
      message.includes('help') ||
      message.includes('options') ||
      message.includes('products') ||
      message.includes('what')
    ) {
      return {
        text: "I can help you with all our banking products! Here's what we offer:",
        suggestedProducts: products,
      };
    } else {
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
      timestamp: new Date(),
    };

    const botResponse = generateBotResponse(currentMessage);
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      text: botResponse.text,
      sender: 'bot',
      timestamp: new Date(),
      suggestedProducts: botResponse.suggestedProducts,
    };

    setChatMessages((prev) => [...prev, userMessage, botMessage]);
    setCurrentMessage('');
  };

  const handleCustomerSubmit = (data: CustomerData) => {
    setCustomerData(data);
    setCurrentStep(2); // Go to step 2 (Application Details) after Customer Details
  };

  const handleApplicationSubmit = (data: ApplicationData) => {
    setApplicationData(data);
    setCurrentStep(3); // Go to step 3 (Document Upload) after Application Details
  };

  const handleDocumentsSubmit = (docs: string[], jointDocs?: string[]) => {
    setDocuments(docs);
    if (jointDocs) {
      setJointDocuments(jointDocs);
    }
    if (customerData?.isJoint) {
      setCurrentStep(4); // Go to step 4 (Joint Verification) if joint
    } else {
      setCurrentStep(5); // Go to step 5 (Review & Decision) if single
    }
  };

  const handleJointVerificationComplete = () => {
    setCurrentStep(5); // Go to step 5 (Review & Decision) after Joint Verification
  };

  const handleDecision = (approved: boolean) => {
    if (approved) {
      setCurrentStep(6); // Go to step 6 (Agreement) if approved
    } else {
      alert('Application denied. Please contact our support team.');
    }
  };

  const handleAgreementSign = () => {
    setCurrentStep(7); // Go to step 7 (Completion) after signing
  };

  return (
    <Container maxWidth="lg" className="fade-in">
      <AppBar
        position="static"
        sx={{
          mb: 4,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.3)',
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            <AccountBalance sx={{ mr: 1, fontSize: 32 }} />
            <Typography
              variant="h5"
              component="div"
              sx={{ fontWeight: 'bold', letterSpacing: 1 }}
            >
              Personal Banking
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Chip
            label={`Step ${currentStep + 2} of ${steps.length}`}
            color="secondary"
            variant="filled"
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 'bold',
              backdropFilter: 'blur(10px)',
            }}
          />
        </Toolbar>
      </AppBar>

      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        }}
      >
        <Stepper
          activeStep={currentStep + 2}
          sx={{
            '& .MuiStepIcon-root': {
              fontSize: '1.8rem',
              '&.Mui-active': {
                color: '#1976d2',
                transform: 'scale(1.1)',
                transition: 'all 0.3s ease',
              },
              '&.Mui-completed': {
                color: '#4caf50',
              },
            },
            '& .MuiStepLabel-label': {
              fontWeight: 500,
              '&.Mui-active': {
                fontWeight: 'bold',
              },
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Paper>

      {/* Step -1: AI Assistant Chat */}
      {currentStep === -1 && (
        <Box className="slide-in-right">
          <AIChatInterface
            messages={chatMessages}
            currentMessage={currentMessage}
            onMessageChange={setCurrentMessage}
            onSendMessage={handleSendMessage}
            onProductSelect={handleChatProductSelect}
            onProceedToProducts={() => setCurrentStep(0)}
          />
        </Box>
      )}

      {/* Step 0: Product Selection */}
      {currentStep === 0 && (
        <Box className="fade-in">
          <ProductSelectionStep
            products={products}
            onProductSelect={handleProductSelect}
            onBack={handleBack}
          />
        </Box>
      )}

      {/* Step 1: Customer Details */}
      {currentStep === 1 && selectedProduct && (
        <Box className="fade-in">
          <Box display="flex" alignItems="center" gap={2} mb={4}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={handleBack}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1.5,
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                },
                transition: 'all 0.3s ease',
              }}
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

      {/* Additional steps would continue here... */}
      {/* For brevity, I'm including placeholder text for the remaining steps */}
      {currentStep >= 2 && (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography variant="h4" gutterBottom>
            Step {currentStep + 2}: {steps[currentStep + 1]}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This step will be implemented with enhanced UI/UX
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 3 }}
            onClick={() => setCurrentStep(currentStep + 1)}
          >
            Continue to Next Step
          </Button>
        </Box>
      )}
    </Container>
  );
}

// AI Chat Interface Component
const AIChatInterface: React.FC<{
  messages: Array<{
    role?: 'user' | 'assistant';
    content?: string;
    text?: string;
    sender?: 'user' | 'bot';
    suggestedProducts?: Product[];
  }>;
  currentMessage: string;
  onMessageChange: (message: string) => void;
  onSendMessage: () => void;
  onProductSelect?: (product: Product) => void;
  onProceedToProducts?: () => void;
}> = ({
  messages,
  currentMessage,
  onMessageChange,
  onSendMessage,
  onProceedToProducts,
}) => {
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 4,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}
    >
      <Box sx={{ p: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            display: 'flex',
            alignItems: 'center',
            fontWeight: 'bold',
            mb: 3,
          }}
        >
          <SmartToy sx={{ mr: 2, fontSize: 40 }} className="pulse-animation" />
          AI Banking Assistant
        </Typography>

        <Paper
          elevation={0}
          sx={{
            height: '400px',
            p: 3,
            mb: 3,
            overflow: 'auto',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
          }}
        >
          {messages.map((message, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent:
                    message.role === 'user' || message.sender === 'user'
                      ? 'flex-end'
                      : 'flex-start',
                  mb: 1,
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    p: 2,
                    maxWidth: '75%',
                    borderRadius: 3,
                    background:
                      message.role === 'user' || message.sender === 'user'
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                        : 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    transform: 'scale(0.98)',
                    transition: 'transform 0.2s ease',
                    '&:hover': {
                      transform: 'scale(1)',
                    },
                  }}
                >
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {message.content || message.text}
                  </Typography>
                </Paper>
              </Box>
              {message.suggestedProducts && (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                  {message.suggestedProducts.map((product) => (
                    <Chip
                      key={product.id}
                      label={product.name}
                      onClick={() => {
                        /* onProductSelect && onProductSelect(product) */
                      }}
                      variant="outlined"
                      sx={{
                        borderColor: '#667eea',
                        color: '#667eea',
                        fontWeight: 500,
                        '&:hover': {
                          backgroundColor: '#667eea',
                          color: 'white',
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          ))}
        </Paper>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            value={currentMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            placeholder="Ask me about loan products or application process..."
            onKeyPress={(e) => e.key === 'Enter' && onSendMessage()}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 3,
                '&:hover fieldset': {
                  borderColor: 'rgba(255, 255, 255, 0.8)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'white',
                  borderWidth: 2,
                },
              },
            }}
          />
          <IconButton
            onClick={onSendMessage}
            sx={{
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              borderRadius: 2,
              p: 1.5,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <Send />
          </IconButton>
          {onProceedToProducts && (
            <Button
              onClick={onProceedToProducts}
              variant="outlined"
              sx={{
                borderColor: 'rgba(255, 255, 255, 0.6)',
                color: 'white',
                borderRadius: 3,
                px: 3,
                borderWidth: 2,
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderWidth: 2,
                },
              }}
            >
              Browse Products
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

// Product Selection Step Component
const ProductSelectionStep: React.FC<{
  products: Product[];
  onProductSelect: (product: Product) => void;
  onBack: () => void;
}> = ({ products, onProductSelect, onBack }) => {
  return (
    <Box>
      <Box sx={{ textAlign: 'center', mb: 5 }}>
        <Typography
          variant="h3"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#1976d2' }}
        >
          Choose Your Banking Product
        </Typography>
        <Typography
          variant="h6"
          sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}
        >
          Select the financial product that best fits your needs and start your
          application journey
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {products.map((product, index) => (
          <Grid item xs={12} md={6} key={product.id}>
            <Card
              sx={{
                cursor: 'pointer',
                height: '100%',
                background: `linear-gradient(135deg, ${product.color}15 0%, ${product.color}25 100%)`,
                border: `2px solid ${product.color}30`,
                borderRadius: 4,
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: 'translateY(0)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 20px 40px ${product.color}40`,
                  border: `2px solid ${product.color}60`,
                },
                animation: `fadeIn 0.6s ease-out ${index * 0.1}s both`,
              }}
              onClick={() => onProductSelect(product)}
            >
              <CardContent
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: `${product.color}20`,
                      mr: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {React.cloneElement(product.icon, {
                      sx: { fontSize: 32, color: product.color },
                    })}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{ fontWeight: 'bold', color: product.color }}
                  >
                    {product.name}
                  </Typography>
                </Box>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ mb: 3, lineHeight: 1.6, flexGrow: 1 }}
                >
                  {product.description}
                </Typography>

                <Box sx={{ mb: 3 }}>
                  {product.features.map((feature, idx) => (
                    <Chip
                      key={idx}
                      label={feature}
                      size="small"
                      sx={{
                        mr: 1,
                        mb: 1,
                        backgroundColor: `${product.color}15`,
                        color: product.color,
                        border: `1px solid ${product.color}30`,
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>

                <Divider
                  sx={{ mb: 2, backgroundColor: `${product.color}20` }}
                />

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      APR
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: product.color, fontWeight: 'bold' }}
                    >
                      {product.interestRate}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      display="block"
                    >
                      Up to
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ color: product.color, fontWeight: 'bold' }}
                    >
                      {product.maxAmount}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
        <Button
          onClick={onBack}
          startIcon={<ArrowBack />}
          variant="outlined"
          size="large"
          sx={{
            borderRadius: 3,
            px: 4,
            py: 1.5,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          Back to Chat
        </Button>
      </Box>
    </Box>
  );
};

// Bank Statement Upload Component
const BankStatementUpload: React.FC<{
  onUpload: (data: Partial<CustomerData>) => void;
  applicantType: 'Primary' | 'Joint';
}> = ({ onUpload, applicantType }) => {
  const [isUploaded, setIsUploaded] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate API call and data extraction
      setTimeout(() => {
        const firstNames = [
          'John',
          'Jane',
          'Michael',
          'Sarah',
          'David',
          'Emily',
        ];
        const lastNames = [
          'Smith',
          'Johnson',
          'Williams',
          'Brown',
          'Jones',
          'Garcia',
        ];
        const cities = [
          'New York',
          'Los Angeles',
          'Chicago',
          'Houston',
          'Phoenix',
        ];
        const states = ['NY', 'CA', 'IL', 'TX', 'AZ'];
        const employers = [
          'Tech Corp',
          'Finance Inc',
          'Healthcare Ltd',
          'Education Co',
          'Retail Group',
        ];

        const extractedData: Partial<CustomerData> = {
          firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
          lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
          email: `${firstNames[
            Math.floor(Math.random() * firstNames.length)
          ].toLowerCase()}.${lastNames[
            Math.floor(Math.random() * lastNames.length)
          ].toLowerCase()}@email.com`,
          phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
          dateOfBirth: `19${Math.floor(Math.random() * 30) + 70}-${String(
            Math.floor(Math.random() * 12) + 1
          ).padStart(2, '0')}-${String(
            Math.floor(Math.random() * 28) + 1
          ).padStart(2, '0')}`,
          address: `${Math.floor(Math.random() * 9999) + 1} Main Street`,
          city: cities[Math.floor(Math.random() * cities.length)],
          state: states[Math.floor(Math.random() * states.length)],
          zipCode: String(Math.floor(Math.random() * 90000) + 10000),
          employmentStatus: 'employed',
          employer: employers[Math.floor(Math.random() * employers.length)],
          annualIncome: (Math.floor(Math.random() * 50) + 50) * 1000 + '', // 50k-100k
          monthlyIncome: (Math.floor(Math.random() * 3) + 4) * 1000 + '', // 4k-7k
          monthlyExpenses: (Math.floor(Math.random() * 1.5) + 1) * 1000 + '', // 1k-2.5k
          existingDebts: (Math.floor(Math.random() * 10) + 5) * 1000 + '', // 5k-15k
        };
        onUpload(extractedData);
        setIsUploading(false);
        setIsUploaded(true);
      }, 2000);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        mb: 4,
        borderRadius: 4,
        background: isUploaded
          ? 'linear-gradient(135deg, #4caf50 0%, #81c784 100%)'
          : 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
        color: 'white',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        border: isUploaded
          ? '2px solid #4caf50'
          : '2px dashed rgba(255,255,255,0.5)',
        transition: 'all 0.3s ease',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        {applicantType} Applicant Bank Statement
      </Typography>

      <Typography variant="body1" sx={{ mb: 4, opacity: 0.9, lineHeight: 1.6 }}>
        Upload a bank statement to auto-fill all customer details including
        personal information and financial data using our AI-powered extraction.
      </Typography>

      {isUploading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <CircularProgress sx={{ color: 'white' }} size={48} />
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Processing your document...
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            Our AI is extracting your information
          </Typography>
        </Box>
      ) : (
        <Button
          variant="contained"
          component="label"
          startIcon={isUploaded ? <CheckCircle /> : <UploadFile />}
          disabled={isUploaded}
          size="large"
          sx={{
            backgroundColor: isUploaded
              ? 'rgba(255,255,255,0.2)'
              : 'rgba(255,255,255,0.15)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.3)',
            borderRadius: 3,
            px: 4,
            py: 2,
            fontSize: '1.1rem',
            fontWeight: 'bold',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.25)',
              transform: isUploaded ? 'none' : 'translateY(-2px)',
              boxShadow: isUploaded ? 'none' : '0 8px 25px rgba(0,0,0,0.3)',
            },
            '&:disabled': {
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {isUploaded
            ? 'Document Processed Successfully!'
            : 'Upload Bank Statement'}
          <input
            type="file"
            hidden
            onChange={handleFileUpload}
            accept=".pdf,.png,.jpg,.jpeg"
          />
        </Button>
      )}

      {isUploaded && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            ✓ All customer details have been automatically filled from your bank
            statement
          </Typography>
        </Box>
      )}
    </Paper>
  );
};

// Customer Details Form Component
const CustomerDetailsForm: React.FC<{
  product: Product | null;
  onSubmit: (data: CustomerData) => void;
}> = ({ product, onSubmit }) => {
  const [applicationType, setApplicationType] = React.useState<
    'single' | 'joint' | ''
  >('');
  const [formData, setFormData] = React.useState<CustomerData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    employmentStatus: '',
    employer: '',
    annualIncome: '',
    monthlyIncome: '',
    monthlyExpenses: '',
    existingDebts: '',
  });

  const [primaryFinancialsUploaded, setPrimaryFinancialsUploaded] =
    React.useState(false);

  const handleInputChange = (field: keyof CustomerData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBankStatementUpload = (data: Partial<CustomerData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setPrimaryFinancialsUploaded(true);
  };

  const isFormValid = () => {
    const requiredFields: (keyof CustomerData)[] = [
      'firstName',
      'lastName',
      'email',
      'phone',
      'dateOfBirth',
      'address',
      'city',
      'state',
      'zipCode',
      'employmentStatus',
      'employer',
      'annualIncome',
    ];
    return (
      requiredFields.every((field) => formData[field]) &&
      primaryFinancialsUploaded
    );
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      alert('Please fill in all required fields and upload bank statements.');
      return;
    }

    const dataToSubmit: CustomerData = {
      ...formData,
      isJoint: applicationType === 'joint',
    };

    onSubmit(dataToSubmit);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 4,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#1976d2',
          mb: 4,
          textAlign: 'center',
        }}
      >
        Customer Information
      </Typography>

      <Paper
        elevation={2}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)',
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}
        >
          Application Type
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Select Application Type</InputLabel>
          <Select
            value={applicationType}
            onChange={(e) =>
              setApplicationType(e.target.value as 'single' | 'joint')
            }
            label="Select Application Type"
            sx={{
              borderRadius: 2,
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
                borderWidth: 2,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#1976d2',
                borderWidth: 2,
              },
            }}
          >
            <MenuItem value="single">Individual Application</MenuItem>
            <MenuItem value="joint">Joint Application</MenuItem>
          </Select>
        </FormControl>
      </Paper>

      {/* Bank Statement Upload */}
      {applicationType && (
        <>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 'bold', color: '#1976d2', mt: 4, mb: 3 }}
          >
            {applicationType === 'single'
              ? 'Applicant Details'
              : 'Primary Applicant Details'}
          </Typography>

          <BankStatementUpload
            applicantType="Primary"
            onUpload={handleBankStatementUpload}
          />

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                required
                disabled={!primaryFinancialsUploaded}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                      borderWidth: 2,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                required
                disabled={!primaryFinancialsUploaded}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                      borderWidth: 2,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
                disabled={!primaryFinancialsUploaded}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                      borderWidth: 2,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                required
                disabled={!primaryFinancialsUploaded}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    '&:hover fieldset': {
                      borderColor: '#1976d2',
                      borderWidth: 2,
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#1976d2',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>
            {/* Add remaining form fields with similar styling... */}
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={handleSubmit}
              disabled={!isFormValid()}
              startIcon={<ArrowForward />}
              sx={{
                py: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                borderRadius: 3,
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                '&:hover': {
                  background:
                    'linear-gradient(135deg, #1565c0 0%, #0d47a1 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(25, 118, 210, 0.5)',
                },
                '&:disabled': {
                  background: 'linear-gradient(135deg, #ccc 0%, #999 100%)',
                  transform: 'none',
                  boxShadow: 'none',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Continue to Application Details →
            </Button>
          </Box>
        </>
      )}
    </Paper>
  );
};

export default App;
