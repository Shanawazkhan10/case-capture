import type { Dispatch, SetStateAction } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '../../../components/ui/dialog'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QRCodeSVG } from 'qrcode.react'
import { Copy, Check, Mail, Plus, User, Phone, MapPin, Home, Navigation } from 'lucide-react'
import { useState } from 'react'
import { Button } from "@/components/ui/button"

interface AddressForm {
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
}

interface User {
    name: string;
    email: string;
}

const AudienceOverviewModal = ({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}) => {
    const [copied, setCopied] = useState<boolean>(false);
    const [emails, setEmails] = useState<string[]>([
        'jack@unittledul.com',
        'jsemae@unittledul.com',
        'frankie@unittledul.com',
        'matf@unittledul.com',
        'amélie@unittledul.com'
    ]);
    const [newEmail, setNewEmail] = useState<string>('');
    const [emailError, setEmailError] = useState<string>('');

    const [addressForm, setAddressForm] = useState<AddressForm>({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: ''
    });

    const [formErrors, setFormErrors] = useState<Partial<AddressForm>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const dashboardUrl: string = 'DATA: UNIVERSITY.COM';

    // Copy to clipboard function
    const copyToClipboard = (): void => {
        navigator.clipboard.writeText(dashboardUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Email validation
    const validateEmail = (email: string): boolean => {
        const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    // Phone validation
    const validatePhone = (phone: string): boolean => {
        const phoneRegex: RegExp = /^[6-9]\d{9}$/;
        return phoneRegex.test(phone.replace(/\D/g, ''));
    };

    // Pincode validation
    const validatePincode = (pincode: string): boolean => {
        const pincodeRegex: RegExp = /^\d{6}$/;
        return pincodeRegex.test(pincode);
    };

    // Form validation
    const validateForm = (): boolean => {
        const errors: Partial<AddressForm> = {};

        if (!addressForm.fullName.trim()) {
            errors.fullName = 'Full name is required';
        } else if (addressForm.fullName.trim().length < 2) {
            errors.fullName = 'Full name must be at least 2 characters';
        }

        if (!addressForm.phone.trim()) {
            errors.phone = 'Phone number is required';
        } else if (!validatePhone(addressForm.phone)) {
            errors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!addressForm.addressLine1.trim()) {
            errors.addressLine1 = 'Address line 1 is required';
        }

        if (!addressForm.city.trim()) {
            errors.city = 'City is required';
        }

        if (!addressForm.state.trim()) {
            errors.state = 'State is required';
        }

        if (!addressForm.pincode.trim()) {
            errors.pincode = 'Pincode is required';
        } else if (!validatePincode(addressForm.pincode)) {
            errors.pincode = 'Please enter a valid 6-digit pincode';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Handle email addition
    const handleAddEmail = (e: React.FormEvent): void => {
        e.preventDefault();

        if (!newEmail.trim()) {
            setEmailError('Email is required');
            return;
        }

        if (!validateEmail(newEmail)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        if (emails.includes(newEmail.toLowerCase())) {
            setEmailError('This email is already added');
            return;
        }

        setEmails([...emails, newEmail.toLowerCase()]);
        setNewEmail('');
        setEmailError('');
    };

    const handleRemoveEmail = (emailToRemove: string): void => {
        setEmails(emails.filter(email => email !== emailToRemove));
    };

    // Handle address form submission
    const handleAddressSubmit = (e: React.FormEvent): void => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            console.log('Address submitted:', addressForm);
            setIsSubmitting(false);
            // Reset form after successful submission
            setAddressForm({
                fullName: '',
                phone: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                state: '',
                pincode: ''
            });
        }, 1000);
    };

    // Handle input changes
    const handleInputChange = (field: keyof AddressForm, value: string): void => {
        setAddressForm(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: undefined
            }));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="z-[9999999] w-[95vw] max-w-6xl max-h-[95vh] overflow-y-auto bg-white">
                <DialogHeader className="text-left">
                    <DialogTitle className="text-2xl font-bold">
                        Audience Overview
                    </DialogTitle>
                    <DialogDescription>
                        Manage your dashboard audience and invite new members.
                    </DialogDescription>
                </DialogHeader>

                {/* Published Status */}
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <p className="text-green-800 text-sm">
                        Your dashboard is published. Future changes will be published automatically.
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                    {/* Left Side - QR Code and Dashboard Link */}
                    <div className="space-y-6">
                        {/* Dashboard Link Section */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">Dashboard Link</h3>

                            <div className="flex items-center gap-2">
                                <Input
                                    value={dashboardUrl}
                                    readOnly
                                    className="flex-1 font-mono font-semibold text-gray-900"
                                />
                                <Button
                                    onClick={copyToClipboard}
                                    variant="outline"
                                    className="flex items-center gap-2 min-w-[100px]"
                                >
                                    {copied ? (
                                        <Check className="w-4 h-4 text-green-600" />
                                    ) : (
                                        <Copy className="w-4 h-4" />
                                    )}
                                    {copied ? 'Copied!' : 'Copy'}
                                </Button>
                            </div>

                            <Button variant="outline" className="w-full flex items-center gap-2">
                                <Plus className="w-4 h-4" />
                                Add custom domain
                            </Button>
                        </div>

                        {/* QR Code */}
                        <div className="text-center space-y-3 p-6 border-2 border-dashed border-gray-200 rounded-lg">
                            <div className="inline-block p-4 bg-white rounded-lg">
                                <QRCodeSVG
                                    value={`https://${dashboardUrl}`}
                                    size={180}
                                    level="M"
                                    includeMargin={false}
                                />
                            </div>
                            <p className="text-sm text-gray-600">
                                Scan this code with your phone to open your dashboard in the app.
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Address Form */}
                    <div className="space-y-6">
                        <form onSubmit={handleAddressSubmit} className="space-y-6">
                            {/* Full Name */}
                            <div className="space-y-3">
                                <Label htmlFor="fullName" className="text-base font-semibold">
                                    Full Name
                                </Label>
                                <Input
                                    id="fullName"
                                    value={addressForm.fullName}
                                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                                    placeholder="Enter your full name"
                                    className={formErrors.fullName ? 'border-red-500' : ''}
                                />
                                {formErrors.fullName && (
                                    <p className="text-red-500 text-sm">{formErrors.fullName}</p>
                                )}
                            </div>

                            {/* Phone Number */}
                            <div className="space-y-3">
                                <Label htmlFor="phone" className="text-base font-semibold">
                                    Phone Number
                                </Label>
                                <Input
                                    id="phone"
                                    value={addressForm.phone}
                                    onChange={(e) => handleInputChange('phone', e.target.value)}
                                    placeholder="Enter your 10-digit phone number"
                                    className={formErrors.phone ? 'border-red-500' : ''}
                                />
                                {formErrors.phone && (
                                    <p className="text-red-500 text-sm">{formErrors.phone}</p>
                                )}
                            </div>

                            {/* Address Line 1 */}
                            <div className="space-y-3">
                                <Label htmlFor="addressLine1" className="text-base font-semibold">
                                    Address Line 1
                                </Label>
                                <Input
                                    id="addressLine1"
                                    value={addressForm.addressLine1}
                                    onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                                    placeholder="House No., Street, Area"
                                    className={formErrors.addressLine1 ? 'border-red-500' : ''}
                                />
                                {formErrors.addressLine1 && (
                                    <p className="text-red-500 text-sm">{formErrors.addressLine1}</p>
                                )}
                            </div>

                            {/* Address Line 2 */}
                            <div className="space-y-3">
                                <Label htmlFor="addressLine2" className="text-base font-semibold">
                                    Address Line 2 (Optional)
                                </Label>
                                <Input
                                    id="addressLine2"
                                    value={addressForm.addressLine2}
                                    onChange={(e) => handleInputChange('addressLine2', e.target.value)}
                                    placeholder="Landmark, Building Name"
                                />
                            </div>

                            {/* City and State */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <Label htmlFor="city" className="text-base font-semibold">
                                        City
                                    </Label>
                                    <Input
                                        id="city"
                                        value={addressForm.city}
                                        onChange={(e) => handleInputChange('city', e.target.value)}
                                        placeholder="Enter city"
                                        className={formErrors.city ? 'border-red-500' : ''}
                                    />
                                    {formErrors.city && (
                                        <p className="text-red-500 text-sm">{formErrors.city}</p>
                                    )}
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="state" className="text-base font-semibold">
                                        State
                                    </Label>
                                    <Input
                                        id="state"
                                        value={addressForm.state}
                                        onChange={(e) => handleInputChange('state', e.target.value)}
                                        placeholder="Enter state"
                                        className={formErrors.state ? 'border-red-500' : ''}
                                    />
                                    {formErrors.state && (
                                        <p className="text-red-500 text-sm">{formErrors.state}</p>
                                    )}
                                </div>
                            </div>

                            {/* Pincode */}
                            <div className="space-y-3">
                                <Label htmlFor="pincode" className="text-base font-semibold">
                                    Pincode
                                </Label>
                                <Input
                                    id="pincode"
                                    value={addressForm.pincode}
                                    onChange={(e) => handleInputChange('pincode', e.target.value)}
                                    placeholder="Enter 6-digit pincode"
                                    className={formErrors.pincode ? 'border-red-500' : ''}
                                />
                                {formErrors.pincode && (
                                    <p className="text-red-500 text-sm">{formErrors.pincode}</p>
                                )}
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#16a34a] hover:bg-green-700 text-white py-3 text-base"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Address'}
                            </Button>
                        </form>

                        {/* Email Invitation - Removed as per your design */}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default AudienceOverviewModal;