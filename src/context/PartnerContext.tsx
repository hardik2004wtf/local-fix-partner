import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ExtraMaterial {
  id: string;
  name: string;
  cost: number;
}

export interface JobItem {
  id: string;
  type: 'urgent' | 'scheduled' | 'society';
  badgeText: string;
  badgeTime?: string;
  priceRange: string;
  baseOffer: number;
  title: string;
  customerName: string;
  customerAddress: string;
  isCustomerVerified: boolean;
  distance: string;
  wardInfo: string;
  images?: string[];
  imageLabels?: string[];
  requiredTool?: string;
  guaranteeNote?: string;
  status: 'available' | 'accepted' | 'completed';
}

export interface Settlement {
  id: string;
  title: string;
  amount: number;
  customer: string;
  location: string;
  time: string;
  receiptNumber: string;
  paymentType: string;
  tag: string;
  subtag?: string;
  icon: 'wrench' | 'water' | 'pump';
}

export interface PartnerProfile {
  name: string;
  phone: string;
  trade: string;
  badge: string;
  avatarUrl: string;
  isOnline: boolean;
  city: string;
  ward: string;
  radiusKm: number;
  rating: number;
  totalJobs: number;
  onTimeRate: number;
  todayJobsCount: number;
  todayEarnings: number;
  cryptographicId: string;
  kyc: {
    aadhaarVerified: boolean;
    policeCleared: boolean;
    skillCertified: boolean;
    bankLinked: boolean;
  };
  skills: string[];
  operatingHours: string;
  sosDispatchEnabled: boolean;
}

export interface ChecklistItem {
  id: number;
  title: string;
  time: string;
  desc: string;
  status: 'completed' | 'ongoing' | 'pending';
  photoUrl?: string;
  photoLabel?: string;
}

export interface ActiveTicketState {
  id: string;
  category: string;
  status: 'IN_PROGRESS' | 'COMPLETED';
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerAvatar: string;
  pin: string;
  pinVerified: boolean;
  executionSeconds: number;
  scheduledWindow: string;
  checklist: ChecklistItem[];
  extraMaterials: ExtraMaterial[];
  labourCost: number;
}

interface PartnerContextType {
  partner: PartnerProfile;
  toggleOnline: () => void;
  toggleSos: () => void;
  updateProfile: (updates: Partial<PartnerProfile>) => void;
  // Active ticket state
  activeTicket: ActiveTicketState;
  addExtraMaterial: (name: string, cost: number) => void;
  completeActiveJob: (otp: string) => boolean;
  activeTimerRunning: boolean;
  // Jobs feed state
  jobs: JobItem[];
  acceptJob: (jobId: string, customQuote?: number) => void;
  activeFilter: 'all' | 'urgent' | 'near';
  setActiveFilter: (filter: 'all' | 'urgent' | 'near') => void;
  // Earnings & Wallet
  walletBalance: number;
  thisWeekEarnings: number;
  avgPerJob: number;
  bonusEarned: number;
  settlements: Settlement[];
  withdrawFunds: (amount: number) => { success: boolean; refId: string };
  // Modals & User Connection
  callingCustomer: boolean;
  setCallingCustomer: (val: boolean) => void;
  isRegisterModalOpen: boolean;
  setIsRegisterModalOpen: (val: boolean) => void;
}

const initialActiveTicket: ActiveTicketState = {
  id: 'Ticket #LF-8492',
  category: 'Plumbing Diagnostic',
  status: 'IN_PROGRESS',
  customerName: 'Ayush Verma',
  customerPhone: '+91 98352 14821',
  customerAddress: 'ABC Heights, Flat A-204, Mithanpura, Muzaffarpur',
  customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  pin: '4821',
  pinVerified: true,
  executionSeconds: 1462, // 00:24:22 in seconds
  scheduledWindow: '10:00 - 11:00 AM',
  checklist: [
    {
      id: 1,
      title: 'Dispatched to Location',
      time: '09:30 AM',
      desc: 'Confirmed route from Mithanpura workshop',
      status: 'completed',
    },
    {
      id: 2,
      title: 'Arrived & Resident Handshake',
      time: '09:48 AM',
      desc: 'Society gate entry approved, OTP confirmed',
      status: 'completed',
    },
    {
      id: 3,
      title: 'Kitchen Sink Pipe Replacement',
      time: '10:00 AM (Ongoing)',
      desc: 'P-trap disassembled, main inlet valve sealed',
      status: 'ongoing',
      photoUrl: 'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=400&q=80',
      photoLabel: 'Initial leak diagnostic photo recorded.',
    },
    {
      id: 4,
      title: 'Extra Materials & Consumables',
      time: '1 Item Added',
      desc: 'Heavy Brass Coupling + PTFE Tape',
      status: 'completed',
    },
    {
      id: 5,
      title: 'Inspection & Resident Sign-off',
      time: 'Pending',
      desc: 'High-pressure water flow test & resident digital signature',
      status: 'pending',
    },
  ],
  extraMaterials: [
    { id: 'mat-1', name: 'Heavy Brass Coupling + PTFE T...', cost: 120 },
  ],
  labourCost: 250,
};

const initialPartner: PartnerProfile = {
  name: 'Rahul Kumar',
  phone: '+91 98765 43210',
  trade: 'Plumbing Specialist',
  badge: 'PRO',
  avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
  isOnline: true,
  city: 'Muzaffarpur',
  ward: 'Ward 12',
  radiusKm: 4.5,
  rating: 4.9,
  totalJobs: 142,
  onTimeRate: 98,
  todayJobsCount: 2,
  todayEarnings: 850,
  cryptographicId: 'MP-PLUMB-9842 - Sec-Patch 2025.1',
  kyc: {
    aadhaarVerified: true,
    policeCleared: true,
    skillCertified: true,
    bankLinked: true,
  },
  skills: ['Plumbing', 'Pipe Fitting', 'Overhead Tanks'],
  operatingHours: '08:00 AM – 08:00 PM (Daily)',
  sosDispatchEnabled: false,
};

const initialJobs: JobItem[] = [
  {
    id: 'LF-8492',
    type: 'urgent',
    badgeText: 'URGENT',
    badgeTime: '12m ago',
    priceRange: '₹350 – ₹500',
    baseOffer: 350,
    title: 'Kitchen Sink Pipe Burst & Valve Seep',
    customerName: 'Ayush',
    customerAddress: 'Flat A-204, ABC Heights, Mithanpura',
    isCustomerVerified: true,
    distance: '2.8 km away',
    wardInfo: 'Ward 12 Inner Circle',
    images: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=500&q=80',
    ],
    imageLabels: ['Main Joint Crack', 'Valve Thread'],
    status: 'accepted',
  },
  {
    id: 'LF-8493',
    type: 'scheduled',
    badgeText: 'SCHEDULED',
    badgeTime: 'Today 2:30 PM',
    priceRange: '₹250 Fixed Rate',
    baseOffer: 250,
    title: 'Bathroom Tap Replacement & Angle Valve',
    customerName: 'Pooja Sharma',
    customerAddress: 'House #14, Brahmpura',
    isCustomerVerified: true,
    distance: '4.1 km',
    wardInfo: 'Materials already purchased by owner',
    requiredTool: '12-inch pipe wrench + PTFE teflon roll',
    status: 'available',
  },
  {
    id: 'LF-8494',
    type: 'society',
    badgeText: 'SOCIETY MAINTENANCE',
    priceRange: '₹450 Standard Payout',
    baseOffer: 450,
    title: 'Overhead 5000L Water Tank Overflow Sensor',
    customerName: 'Green View Society, Rooftop • Tower C',
    customerAddress: 'Green View Society, Rooftop • Tower C',
    isCustomerVerified: true,
    distance: '1.9 km away',
    wardInfo: 'Ladder access unlocked',
    guaranteeNote: 'Guaranteed digital invoice clearing within 1 hour',
    status: 'available',
  },
];

const initialSettlements: Settlement[] = [
  {
    id: 'SET-1',
    title: 'Kitchen Pipe Joint Repair',
    amount: 370,
    customer: 'Ayush',
    location: 'ABC Heights, Tower A',
    time: 'Today, 11:30 AM',
    receiptNumber: 'INV-8492',
    paymentType: 'UPI Direct',
    tag: 'Settled Instantly',
    icon: 'wrench',
  },
  {
    id: 'SET-2',
    title: 'Bathroom Mixer Tap I...',
    amount: 300,
    customer: 'Dr. Verma',
    location: 'Club Rd, Opp Gymkhana',
    time: 'Yesterday, 4:15 PM',
    receiptNumber: 'INV-8411',
    paymentType: 'Labor + Material Fix',
    tag: 'Customer Verified',
    icon: 'water',
  },
  {
    id: 'SET-3',
    title: 'Society Water Pump ...',
    amount: 600,
    customer: 'Green View Apartments',
    location: 'Tower B Baseworks',
    time: 'Yesterday, 1:00 PM',
    receiptNumber: 'INV-8389',
    paymentType: 'Includes Overtime Allowance',
    tag: 'Auto-approved',
    icon: 'pump',
  },
];

const PartnerContext = createContext<PartnerContextType | null>(null);

export function PartnerProvider({ children }: { children: React.ReactNode }) {
  const [partner, setPartner] = useState<PartnerProfile>(initialPartner);
  const [jobs, setJobs] = useState<JobItem[]>(initialJobs);
  const [activeFilter, setActiveFilter] = useState<'all' | 'urgent' | 'near'>('all');
  const [walletBalance, setWalletBalance] = useState<number>(3420);
  const [thisWeekEarnings, setThisWeekEarnings] = useState<number>(6850);
  const [settlements, setSettlements] = useState<Settlement[]>(initialSettlements);
  const [callingCustomer, setCallingCustomer] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Active Job Ticket
  const [activeTicket, setActiveTicket] = useState<ActiveTicketState>(initialActiveTicket);

  const [activeTimerRunning, setActiveTimerRunning] = useState(true);

  // Live work clock timer
  useEffect(() => {
    if (!activeTimerRunning || activeTicket.status === 'COMPLETED') return;
    const interval = setInterval(() => {
      setActiveTicket((prev) => ({
        ...prev,
        executionSeconds: prev.executionSeconds + 1,
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTimerRunning, activeTicket.status]);

  const toggleOnline = () => {
    setPartner((prev) => ({ ...prev, isOnline: !prev.isOnline }));
  };

  const toggleSos = () => {
    setPartner((prev) => ({ ...prev, sosDispatchEnabled: !prev.sosDispatchEnabled }));
  };

  const updateProfile = (updates: Partial<PartnerProfile>) => {
    setPartner((prev) => ({ ...prev, ...updates }));
  };

  const addExtraMaterial = (name: string, cost: number) => {
    const newMat: ExtraMaterial = {
      id: `mat-${Date.now()}`,
      name,
      cost,
    };
    setActiveTicket((prev) => ({
      ...prev,
      extraMaterials: [...prev.extraMaterials, newMat],
    }));
  };

  const completeActiveJob = (otp: string) => {
    if (otp !== '7392' && otp !== '4821' && otp.length < 4) {
      return false;
    }
    const totalExtra = activeTicket.extraMaterials.reduce((acc, m) => acc + m.cost, 0);
    const totalAmount = activeTicket.labourCost + totalExtra;

    setActiveTicket((prev) => ({
      ...prev,
      status: 'COMPLETED',
      checklist: prev.checklist.map((item) => ({ ...item, status: 'completed' })),
    }));
    setActiveTimerRunning(false);

    // Update wallet and settlements
    setWalletBalance((prev) => prev + totalAmount);
    setThisWeekEarnings((prev) => prev + totalAmount);
    setPartner((prev) => ({
      ...prev,
      todayEarnings: prev.todayEarnings + totalAmount,
      todayJobsCount: prev.todayJobsCount + 1,
      totalJobs: prev.totalJobs + 1,
    }));

    const newSettlement: Settlement = {
      id: `SET-${Date.now()}`,
      title: activeTicket.category,
      amount: totalAmount,
      customer: activeTicket.customerName,
      location: activeTicket.customerAddress.slice(0, 24) + '...',
      time: 'Just now',
      receiptNumber: 'INV-8492',
      paymentType: 'UPI Direct',
      tag: 'Settled Instantly',
      icon: 'wrench',
    };
    setSettlements((prev) => [newSettlement, ...prev]);
    return true;
  };

  const acceptJob = (jobId: string, customQuote?: number) => {
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: 'accepted' } : j))
    );
    const accepted = jobs.find((j) => j.id === jobId);
    if (accepted) {
      setActiveTicket((prev) => ({
        ...prev,
        id: `Ticket #${accepted.id}`,
        category: accepted.title,
        status: 'IN_PROGRESS',
        customerName: accepted.customerName,
        customerAddress: accepted.customerAddress,
        labourCost: customQuote || accepted.baseOffer,
      }));
      setActiveTimerRunning(true);
    }
  };

  const withdrawFunds = (amount: number) => {
    if (amount > walletBalance) return { success: false, refId: '' };
    setWalletBalance((prev) => prev - amount);
    const refId = `IMPS${Math.floor(100000000 + Math.random() * 900000000)}`;
    return { success: true, refId };
  };

  return (
    <PartnerContext.Provider
      value={{
        partner,
        toggleOnline,
        toggleSos,
        updateProfile,
        activeTicket,
        addExtraMaterial,
        completeActiveJob,
        activeTimerRunning,
        jobs,
        acceptJob,
        activeFilter,
        setActiveFilter,
        walletBalance,
        thisWeekEarnings,
        avgPerJob: 380,
        bonusEarned: 300,
        settlements,
        withdrawFunds,
        callingCustomer,
        setCallingCustomer,
        isRegisterModalOpen,
        setIsRegisterModalOpen,
      }}>
      {children}
    </PartnerContext.Provider>
  );
}

export function usePartner() {
  const ctx = useContext(PartnerContext);
  if (!ctx) throw new Error('usePartner must be used inside PartnerProvider');
  return ctx;
}
