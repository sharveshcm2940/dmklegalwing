import { DistrictSubUnit } from '../types';

export interface DistrictMapItem {
  id: string;
  name: { en: string; ta: string };
  headquarters: { en: string; ta: string };
  zone: 'Chennai' | 'North' | 'West' | 'Central' | 'South';
  path: string;
  labelX: number;
  labelY: number;
  units: DistrictSubUnit[];
}

export const DISTRICT_MAP_DATA: DistrictMapItem[] = [
  {
    id: 'tiruvannamalai',
    name: { en: 'Tiruvannamalai', ta: 'திருவண்ணாமலை' },
    headquarters: { en: 'Tiruvannamalai', ta: 'திருவண்ணாமலை' },
    zone: 'North',
    labelX: 320,
    labelY: 175,
    path: 'M 285,150 L 330,135 L 350,140 L 365,130 L 375,145 L 360,165 L 368,180 L 335,195 L 305,210 L 280,200 L 285,170 Z',
    units: [
      {
        id: 'tvm-east',
        number: 1,
        name: { en: 'Tiruvannamalai East', ta: 'திருவண்ணாமலை கிழக்கு' },
        organizer: { en: 'Adv. M. Senthil Kumar', ta: 'வழக்கறிஞர் மு. செந்தில்குமார்' },
        court: { en: 'District & Sessions Court, Tiruvannamalai', ta: 'மாவட்ட & அமர்வு நீதிமன்றம், திருவண்ணாமலை' },
        memberCount: 480,
        activeCases: 45,
        phone: '+91 94432 18901',
        email: 'tvm.east.legal@dmk.org.in'
      },
      {
        id: 'tvm-north',
        number: 2,
        name: { en: 'Tiruvannamalai North', ta: 'திருவண்ணாமலை வடக்கு' },
        organizer: { en: 'Adv. K. Annamalai', ta: 'வழக்கறிஞர் கே. அண்ணாமலை' },
        court: { en: 'Sub Court Complex, Arani', ta: 'சார்சுற்று நீதிமன்றம், ஆரணி' },
        memberCount: 390,
        activeCases: 38,
        phone: '+91 94433 29012',
        email: 'tvm.north.legal@dmk.org.in'
      },
      {
        id: 'tvm-south',
        number: 3,
        name: { en: 'Tiruvannamalai South', ta: 'திருவண்ணாமலை தெற்கு' },
        organizer: { en: 'Adv. R. Venkatesan', ta: 'வழக்கறிஞர் ஆர். வெங்கடேசன்' },
        court: { en: 'Sub Court Complex, Chengam', ta: 'சார்சுற்று நீதிமன்றம், செங்கம்' },
        memberCount: 420,
        activeCases: 41,
        phone: '+91 94434 30123',
        email: 'tvm.south.legal@dmk.org.in'
      },
      {
        id: 'tvm-west',
        number: 4,
        name: { en: 'Tiruvannamalai West', ta: 'திருவண்ணாமலை மேற்கு' },
        organizer: { en: 'Adv. P. Velmurugan', ta: 'வழக்கறிஞர் பி. வேல்முருகன்' },
        court: { en: 'Sub Court Complex, Cheyyar', ta: 'சார்சுற்று நீதிமன்றம், செய்யாறு' },
        memberCount: 360,
        activeCases: 32,
        phone: '+91 94435 41234',
        email: 'tvm.west.legal@dmk.org.in'
      }
    ]
  },
  {
    id: 'chennai',
    name: { en: 'Chennai', ta: 'சென்னை' },
    headquarters: { en: 'Chennai', ta: 'சென்னை' },
    zone: 'Chennai',
    labelX: 430,
    labelY: 95,
    path: 'M 420,85 L 438,80 L 442,105 L 425,115 L 415,100 Z',
    units: [
      {
        id: 'chn-north',
        number: 1,
        name: { en: 'Chennai North', ta: 'சென்னை வடக்கு' },
        organizer: { en: 'Adv. K. Balaji', ta: 'வழக்கறிஞர் கே. பாலாஜி' },
        court: { en: 'George Town Metropolitan Magistrate Court', ta: 'ஜார்ஜ் டவுன் பெருநகர குற்றவியல் நீதிமன்றம்' },
        memberCount: 1100,
        activeCases: 145,
        phone: '+91 98401 22334',
        email: 'chennai.north@dmk.org.in'
      },
      {
        id: 'chn-northeast',
        number: 2,
        name: { en: 'Chennai North-East', ta: 'சென்னை வடகிழக்கு' },
        organizer: { en: 'Adv. R. Saravanan', ta: 'வழக்கறிஞர் ஆர். சரவணன்' },
        court: { en: 'Madras High Court Principal Bench', ta: 'சென்னை உயர் நீதிமன்ற முதன்மை அமர்வு' },
        memberCount: 950,
        activeCases: 120,
        phone: '+91 98402 33445',
        email: 'chennai.northeast@dmk.org.in'
      },
      {
        id: 'chn-central',
        number: 3,
        name: { en: 'Chennai Central', ta: 'சென்னை மத்திய' },
        organizer: { en: 'Adv. M. Anbarasu', ta: 'வழக்கறிஞர் மு. அன்பரசு' },
        court: { en: 'City Civil Court & Egmore Court Complex', ta: 'பெருநகர உரிமையியல் & எழும்பூர் நீதிமன்ற வளாகம்' },
        memberCount: 1250,
        activeCases: 160,
        phone: '+91 98403 44556',
        email: 'chennai.central@dmk.org.in'
      },
      {
        id: 'chn-south',
        number: 4,
        name: { en: 'Chennai South', ta: 'சென்னை தெற்கு' },
        organizer: { en: 'Adv. V. Selvam', ta: 'வழக்கறிஞர் வி. செல்வம்' },
        court: { en: 'Saidapet Metropolitan Magistrate Court', ta: 'சைதாப்பேட்டை பெருநகர நீதிமன்றம்' },
        memberCount: 900,
        activeCases: 105,
        phone: '+91 98404 55667',
        email: 'chennai.south@dmk.org.in'
      }
    ]
  },
  {
    id: 'coimbatore',
    name: { en: 'Coimbatore', ta: 'கோயம்புத்தூர்' },
    headquarters: { en: 'Coimbatore', ta: 'கோயம்புத்தூர்' },
    zone: 'West',
    labelX: 140,
    labelY: 300,
    path: 'M 115,270 L 150,265 L 165,295 L 155,335 L 125,345 L 110,310 Z',
    units: [
      {
        id: 'cbe-urban',
        number: 1,
        name: { en: 'Coimbatore Urban', ta: 'கோவை மாநகர்' },
        organizer: { en: 'Adv. R. Shanmugasundaram', ta: 'வழக்கறிஞர் ஆர். சண்முகசுந்தரம்' },
        court: { en: 'Combined Court Buildings, Arts College Road', ta: 'ஒருங்கிணைந்த நீதிமன்ற வளாகம், கோவை' },
        memberCount: 820,
        activeCases: 78,
        phone: '+91 94421 88990',
        email: 'cbe.urban@dmk.org.in'
      },
      {
        id: 'cbe-north',
        number: 2,
        name: { en: 'Coimbatore North', ta: 'கோவை வடக்கு' },
        organizer: { en: 'Adv. P. Murugesan', ta: 'வழக்கறிஞர் பி. முருகேசன்' },
        court: { en: 'Mettupalayam Sub Court & Sessions Court', ta: 'மேட்டுப்பாளையம் சார்பு நீதிமன்றம்' },
        memberCount: 460,
        activeCases: 42,
        phone: '+91 94422 99001',
        email: 'cbe.north@dmk.org.in'
      },
      {
        id: 'cbe-south',
        number: 3,
        name: { en: 'Coimbatore South', ta: 'கோவை தெற்கு' },
        organizer: { en: 'Adv. S. Kousalya', ta: 'வழக்கறிஞர் எஸ். கௌசல்யா' },
        court: { en: 'Pollachi Sub Court & Principal Sessions Court', ta: 'பொள்ளாச்சி சார்பு நீதிமன்றம்' },
        memberCount: 510,
        activeCases: 48,
        phone: '+91 94423 10112',
        email: 'cbe.south@dmk.org.in'
      }
    ]
  },
  {
    id: 'madurai',
    name: { en: 'Madurai', ta: 'மதுரை' },
    headquarters: { en: 'Madurai', ta: 'மதுரை' },
    zone: 'South',
    labelX: 245,
    labelY: 420,
    path: 'M 220,390 L 260,385 L 275,415 L 260,445 L 225,440 L 210,410 Z',
    units: [
      {
        id: 'mdu-urban',
        number: 1,
        name: { en: 'Madurai Urban', ta: 'மதுரை மாநகர்' },
        organizer: { en: 'Adv. T. Mohanraj', ta: 'வழக்கறிஞர் டி. மோகன்ராஜ்' },
        court: { en: 'Madras High Court Madurai Bench Campus', ta: 'சென்னை உயர்நீதிமன்ற மதுரை கிளை வளாகம்' },
        memberCount: 1150,
        activeCases: 110,
        phone: '+91 94431 44556',
        email: 'madurai.urban@dmk.org.in'
      },
      {
        id: 'mdu-north',
        number: 2,
        name: { en: 'Madurai North', ta: 'மதுரை வடக்கு' },
        organizer: { en: 'Adv. G. Muthuramalingam', ta: 'வழக்கறிஞர் ஜி. முத்துராமலிங்கம்' },
        court: { en: 'District Court Complex, K.K. Nagar', ta: 'மாவட்ட நீதிமன்ற வளாகம், கே.கே.நகர்' },
        memberCount: 680,
        activeCases: 55,
        phone: '+91 94432 55667',
        email: 'madurai.north@dmk.org.in'
      },
      {
        id: 'mdu-south',
        number: 3,
        name: { en: 'Madurai South', ta: 'மதுரை தெற்கு' },
        organizer: { en: 'Adv. A. Fatima Mary', ta: 'வழக்கறிஞர் ஏ. பாத்திமா மேரி' },
        court: { en: 'Tirumangalam Sub Court Complex', ta: 'திருமங்கலம் சார்சுற்று நீதிமன்றம்' },
        memberCount: 570,
        activeCases: 50,
        phone: '+91 94433 66778',
        email: 'madurai.south@dmk.org.in'
      }
    ]
  },
  {
    id: 'salem',
    name: { en: 'Salem', ta: 'சேலம்' },
    headquarters: { en: 'Salem', ta: 'சேலம்' },
    zone: 'West',
    labelX: 250,
    labelY: 245,
    path: 'M 225,225 L 270,215 L 285,245 L 265,275 L 230,270 L 215,245 Z',
    units: [
      {
        id: 'slm-central',
        number: 1,
        name: { en: 'Salem Central', ta: 'சேலம் மத்திய' },
        organizer: { en: 'Adv. M. Rajendran', ta: 'வழக்கறிஞர் மு. ராஜேந்திரன்' },
        court: { en: 'Combined Court Buildings, Hasthampatti, Salem', ta: 'ஒருங்கிணைந்த நீதிமன்ற வளாகம், அஸ்தம்பட்டி' },
        memberCount: 620,
        activeCases: 54,
        phone: '+91 94431 12345',
        email: 'salem.central@dmk.org.in'
      },
      {
        id: 'slm-west',
        number: 2,
        name: { en: 'Salem West', ta: 'சேலம் மேற்கு' },
        organizer: { en: 'Adv. P. Selvaraj', ta: 'வழக்கறிஞர் பி. செல்வராஜ்' },
        court: { en: 'Sub Court Complex, Mettur', ta: 'சார்சுற்று நீதிமன்றம், மேட்டூர்' },
        memberCount: 410,
        activeCases: 36,
        phone: '+91 94432 23456',
        email: 'salem.west@dmk.org.in'
      },
      {
        id: 'slm-east',
        number: 3,
        name: { en: 'Salem East', ta: 'சேலம் கிழக்கு' },
        organizer: { en: 'Adv. S. Manimegalai', ta: 'வழக்கறிஞர் எஸ். மணிமேகலை' },
        court: { en: 'Sub Court Complex, Attur', ta: 'சார்சுற்று நீதிமன்றம், ஆத்தூர்' },
        memberCount: 440,
        activeCases: 38,
        phone: '+91 94433 34567',
        email: 'salem.east@dmk.org.in'
      }
    ]
  },
  {
    id: 'tiruchirappalli',
    name: { en: 'Tiruchirappalli', ta: 'திருச்சிராப்பள்ளி' },
    headquarters: { en: 'Tiruchirappalli', ta: 'திருச்சிராப்பள்ளி' },
    zone: 'Central',
    labelX: 290,
    labelY: 330,
    path: 'M 265,305 L 310,295 L 325,335 L 295,360 L 265,350 L 255,320 Z',
    units: [
      {
        id: 'try-central',
        number: 1,
        name: { en: 'Tiruchi Central', ta: 'திருச்சி மத்திய' },
        organizer: { en: 'Adv. N. Karunakaran', ta: 'வழக்கறிஞர் என். கருணாகரன்' },
        court: { en: 'District & Sessions Court, Cantonment, Tiruchi', ta: 'மாவட்ட & அமர்வு நீதிமன்ற வளாகம், கண்டோன்மென்ட்' },
        memberCount: 710,
        activeCases: 62,
        phone: '+91 94431 67890',
        email: 'trichy.central@dmk.org.in'
      },
      {
        id: 'try-north',
        number: 2,
        name: { en: 'Tiruchi North', ta: 'திருச்சி வடக்கு' },
        organizer: { en: 'Adv. V. Ravichandran', ta: 'வழக்கறிஞர் வி. ரவிச்சந்திரன்' },
        court: { en: 'Sub Court Complex, Musiri & Lalgudi', ta: 'முசிறி & லால்குடி சார்சுற்று நீதிமன்றங்கள்' },
        memberCount: 420,
        activeCases: 35,
        phone: '+91 94432 78901',
        email: 'trichy.north@dmk.org.in'
      },
      {
        id: 'try-south',
        number: 3,
        name: { en: 'Tiruchi South', ta: 'திருச்சி தெற்கு' },
        organizer: { en: 'Adv. K. Thamizhselvi', ta: 'வழக்கறிஞர் கே. தமிழ்ச்செல்வி' },
        court: { en: 'Sub Court Complex, Manapparai', ta: 'மணப்பாறை சார்சுற்று நீதிமன்றம்' },
        memberCount: 380,
        activeCases: 30,
        phone: '+91 94433 89012',
        email: 'trichy.south@dmk.org.in'
      }
    ]
  },
  {
    id: 'tirunelveli',
    name: { en: 'Tirunelveli', ta: 'திருநெல்வேலி' },
    headquarters: { en: 'Tirunelveli', ta: 'திருநெல்வேலி' },
    zone: 'South',
    labelX: 185,
    labelY: 535,
    path: 'M 160,510 L 205,500 L 220,535 L 200,565 L 165,560 L 150,530 Z',
    units: [
      {
        id: 'tnv-central',
        number: 1,
        name: { en: 'Tirunelveli Central', ta: 'நெல்லை மத்திய' },
        organizer: { en: 'Adv. R. Pandian', ta: 'வழக்கறிஞர் ஆர். பாண்டியன்' },
        court: { en: 'District Combined Court Complex, Palayamkottai', ta: 'ஒருங்கிணைந்த நீதிமன்ற வளாகம், பாளையங்கோட்டை' },
        memberCount: 650,
        activeCases: 58,
        phone: '+91 94431 33445',
        email: 'tirunelveli.central@dmk.org.in'
      },
      {
        id: 'tnv-east',
        number: 2,
        name: { en: 'Tirunelveli East', ta: 'நெல்லை கிழக்கு' },
        organizer: { en: 'Adv. S. Murugan', ta: 'வழக்கறிஞர் எஸ். முருகன்' },
        court: { en: 'Sub Court Complex, Ambasamudram', ta: 'அம்பாசமுத்திரம் சார்சுற்று நீதிமன்றம்' },
        memberCount: 380,
        activeCases: 34,
        phone: '+91 94432 44556',
        email: 'tirunelveli.east@dmk.org.in'
      },
      {
        id: 'tnv-west',
        number: 3,
        name: { en: 'Tirunelveli West', ta: 'நெல்லை மேற்கு' },
        organizer: { en: 'Adv. M. Gomathi', ta: 'வழக்கறிஞர் மு. கோமதி' },
        court: { en: 'Sub Court Complex, Cheranmahadevi', ta: 'சேரன்மகாதேவி சார்பு நீதிமன்றம்' },
        memberCount: 350,
        activeCases: 29,
        phone: '+91 94433 55667',
        email: 'tirunelveli.west@dmk.org.in'
      }
    ]
  },
  {
    id: 'vellore',
    name: { en: 'Vellore', ta: 'வேலூர்' },
    headquarters: { en: 'Vellore', ta: 'வேலூர்' },
    zone: 'North',
    labelX: 330,
    labelY: 110,
    path: 'M 305,95 L 355,85 L 370,115 L 340,135 L 305,125 Z',
    units: [
      {
        id: 'vel-central',
        number: 1,
        name: { en: 'Vellore Central', ta: 'வேலூர் மத்திய' },
        organizer: { en: 'Adv. K. Sivakumar', ta: 'வழக்கறிஞர் கே. சிவக்குமார்' },
        court: { en: 'Combined Court Buildings, Sathuvachari, Vellore', ta: 'ஒருங்கிணைந்த நீதிமன்ற வளாகம், சத்துவாச்சாரி' },
        memberCount: 590,
        activeCases: 51,
        phone: '+91 94435 12345',
        email: 'vellore.central@dmk.org.in'
      },
      {
        id: 'vel-east',
        number: 2,
        name: { en: 'Vellore East', ta: 'வேலூர் கிழக்கு' },
        organizer: { en: 'Adv. M. Ananthan', ta: 'வழக்கறிஞர் மு. அனந்தன்' },
        court: { en: 'Sub Court Complex, Katpadi', ta: 'காட்பாடி சார்சுற்று நீதிமன்றம்' },
        memberCount: 390,
        activeCases: 33,
        phone: '+91 94436 23456',
        email: 'vellore.east@dmk.org.in'
      },
      {
        id: 'vel-west',
        number: 3,
        name: { en: 'Vellore West', ta: 'வேலூர் மேற்கு' },
        organizer: { en: 'Adv. T. Selvarani', ta: 'வழக்கறிஞர் டி. செல்வராணி' },
        court: { en: 'Sub Court Complex, Gudiyatham', ta: 'குடியாத்தம் சார்பு நீதிமன்றம்' },
        memberCount: 340,
        activeCases: 28,
        phone: '+91 94437 34567',
        email: 'vellore.west@dmk.org.in'
      }
    ]
  },
  {
    id: 'thanjavur',
    name: { en: 'Thanjavur', ta: 'தஞ்சாவூர்' },
    headquarters: { en: 'Thanjavur', ta: 'தஞ்சாவூர்' },
    zone: 'Central',
    labelX: 355,
    labelY: 340,
    path: 'M 330,315 L 380,310 L 395,345 L 365,375 L 330,355 Z',
    units: [
      {
        id: 'tjr-north',
        number: 1,
        name: { en: 'Thanjavur North', ta: 'தஞ்சை வடக்கு' },
        organizer: { en: 'Adv. A. Senthilnathan', ta: 'வழக்கறிஞர் ஏ. செந்தில்நாதன்' },
        court: { en: 'Kumbakonam Additional District Court Complex', ta: 'கும்பகோணம் கூடுதல் மாவட்ட நீதிமன்றம்' },
        memberCount: 580,
        activeCases: 52,
        phone: '+91 94438 12345',
        email: 'thanjavur.north@dmk.org.in'
      },
      {
        id: 'tjr-south',
        number: 2,
        name: { en: 'Thanjavur South', ta: 'தஞ்சை தெற்கு' },
        organizer: { en: 'Adv. G. Chandrasekhar', ta: 'வழக்கறிஞர் ஜி. சந்திரசேகர்' },
        court: { en: 'Pattukkottai Sub Court Complex', ta: 'பட்டுக்கோட்டை சார்சுற்று நீதிமன்றம்' },
        memberCount: 460,
        activeCases: 40,
        phone: '+91 94439 23456',
        email: 'thanjavur.south@dmk.org.in'
      },
      {
        id: 'tjr-central',
        number: 3,
        name: { en: 'Thanjavur Central', ta: 'தஞ்சை மத்திய' },
        organizer: { en: 'Adv. K. Revathi', ta: 'வழக்கறிஞர் கே. ரேவதி' },
        court: { en: 'District & Sessions Court, Thanjavur', ta: 'மாவட்ட & அமர்வு நீதிமன்ற வளாகம், தஞ்சை' },
        memberCount: 620,
        activeCases: 56,
        phone: '+91 94430 34567',
        email: 'thanjavur.central@dmk.org.in'
      }
    ]
  },
  {
    id: 'dharmapuri',
    name: { en: 'Dharmapuri', ta: 'தர்மபுரி' },
    headquarters: { en: 'Dharmapuri', ta: 'தர்மபுரி' },
    zone: 'West',
    labelX: 250,
    labelY: 175,
    path: 'M 230,150 L 275,145 L 285,185 L 255,210 L 225,180 Z',
    units: [
      {
        id: 'dpi-east',
        number: 1,
        name: { en: 'Dharmapuri East', ta: 'தர்மபுரி கிழக்கு' },
        organizer: { en: 'Adv. R. Thamaraiselvan', ta: 'வழக்கறிஞர் ஆர். தாமரைச்செல்வன்' },
        court: { en: 'Combined Court Buildings, Dharmapuri', ta: 'ஒருங்கிணைந்த நீதிமன்ற வளாகம், தர்மபுரி' },
        memberCount: 460,
        activeCases: 38,
        phone: '+91 94431 88990',
        email: 'dharmapuri.east@dmk.org.in'
      },
      {
        id: 'dpi-west',
        number: 2,
        name: { en: 'Dharmapuri West', ta: 'தர்மபுரி மேற்கு' },
        organizer: { en: 'Adv. C. Munusamy', ta: 'வழக்கறிஞர் சி. முனுசாமி' },
        court: { en: 'Sub Court Complex, Harur', ta: 'அரூர் சார்சுற்று நீதிமன்றம்' },
        memberCount: 390,
        activeCases: 32,
        phone: '+91 94432 99001',
        email: 'dharmapuri.west@dmk.org.in'
      }
    ]
  },
  {
    id: 'villupuram',
    name: { en: 'Villupuram', ta: 'விழுப்புரம்' },
    headquarters: { en: 'Villupuram', ta: 'விழுப்புரம்' },
    zone: 'North',
    labelX: 340,
    labelY: 200,
    path: 'M 320,185 L 365,180 L 375,215 L 340,240 L 315,215 Z',
    units: [
      {
        id: 'vpm-north',
        number: 1,
        name: { en: 'Villupuram North', ta: 'விழுப்புரம் வடக்கு' },
        organizer: { en: 'Adv. Suvai Suresh', ta: 'வழக்கறிஞர் சுவை சுரேஷ்' },
        court: { en: 'District & Sessions Court, Villupuram', ta: 'மாவட்ட & அமர்வு நீதிமன்றம், விழுப்புரம்' },
        memberCount: 510,
        activeCases: 46,
        phone: '+91 94434 11223',
        email: 'villupuram.north@dmk.org.in'
      },
      {
        id: 'vpm-south',
        number: 2,
        name: { en: 'Villupuram South', ta: 'விழுப்புரம் தெற்கு' },
        organizer: { en: 'Adv. K. Ramalingam', ta: 'வழக்கறிஞர் கே. ராமலிங்கம்' },
        court: { en: 'Sub Court Complex, Tindivanam', ta: 'திண்டிவனம் சார்சுற்று நீதிமன்றம்' },
        memberCount: 420,
        activeCases: 37,
        phone: '+91 94435 22334',
        email: 'villupuram.south@dmk.org.in'
      }
    ]
  },
  {
    id: 'cuddalore',
    name: { en: 'Cuddalore', ta: 'கடலூர்' },
    headquarters: { en: 'Cuddalore', ta: 'கடலூர்' },
    zone: 'Central',
    labelX: 380,
    labelY: 245,
    path: 'M 355,225 L 405,215 L 415,260 L 375,285 L 350,255 Z',
    units: [
      {
        id: 'cud-east',
        number: 1,
        name: { en: 'Cuddalore East', ta: 'கடலூர் கிழக்கு' },
        organizer: { en: 'Adv. M. Sundararajan', ta: 'வழக்கறிஞர் மு. சுந்தரராஜன்' },
        court: { en: 'District Court Complex, Manjakuppam, Cuddalore', ta: 'மாவட்ட நீதிமன்ற வளாகம், மஞ்சக்குப்பம்' },
        memberCount: 520,
        activeCases: 47,
        phone: '+91 94436 44556',
        email: 'cuddalore.east@dmk.org.in'
      },
      {
        id: 'cud-west',
        number: 2,
        name: { en: 'Cuddalore West', ta: 'கடலூர் மேற்கு' },
        organizer: { en: 'Adv. P. Balasubramanian', ta: 'வழக்கறிஞர் பி. பாலசுப்பிரமணியன்' },
        court: { en: 'Chidambaram Sub Court Complex', ta: 'சிதம்பரம் சார்சுற்று நீதிமன்றம்' },
        memberCount: 460,
        activeCases: 39,
        phone: '+91 94437 55667',
        email: 'cuddalore.west@dmk.org.in'
      }
    ]
  },
  {
    id: 'nagapattinam',
    name: { en: 'Nagapattinam', ta: 'நாகப்பட்டினம்' },
    headquarters: { en: 'Nagapattinam', ta: 'நாகப்பட்டினம்' },
    zone: 'Central',
    labelX: 415,
    labelY: 330,
    path: 'M 395,305 L 435,300 L 445,355 L 415,365 L 390,335 Z',
    units: [
      {
        id: 'ngp-north',
        number: 1,
        name: { en: 'Nagapattinam North', ta: 'நாகப்பட்டினம் வடக்கு' },
        organizer: { en: 'Adv. K. Maraimalai', ta: 'வழக்கறிஞர் கே. மறைமலை' },
        court: { en: 'Mayiladuthurai & Sirkazhi Courts', ta: 'மயிலாடுதுறை & சீர்காழி நீதிமன்றங்கள்' },
        memberCount: 450,
        activeCases: 41,
        phone: '+91 94438 66778',
        email: 'nagai.north@dmk.org.in'
      },
      {
        id: 'ngp-south',
        number: 2,
        name: { en: 'Nagapattinam South', ta: 'நாகப்பட்டினம் தெற்கு' },
        organizer: { en: 'Adv. Dinesh', ta: 'வழக்கறிஞர் தினேஷ்' },
        court: { en: 'District Court Complex, Nagapattinam', ta: 'மாவட்ட நீதிமன்ற வளாகம், நாகை' },
        memberCount: 410,
        activeCases: 36,
        phone: '+91 94439 77889',
        email: 'nagai.south@dmk.org.in'
      }
    ]
  },
  {
    id: 'thoothukudi',
    name: { en: 'Thoothukudi', ta: 'தூத்துக்குடி' },
    headquarters: { en: 'Thoothukudi', ta: 'தூத்துக்குடி' },
    zone: 'South',
    labelX: 250,
    labelY: 530,
    path: 'M 225,505 L 270,495 L 285,540 L 255,570 L 220,545 Z',
    units: [
      {
        id: 'tkd-north',
        number: 1,
        name: { en: 'Thoothukudi North', ta: 'தூத்துக்குடி வடக்கு' },
        organizer: { en: 'Adv. Manoj', ta: 'வழக்கறிஞர் மனோஜ்' },
        court: { en: 'Combined Court Buildings, Thoothukudi', ta: 'ஒருங்கிணைந்த நீதிமன்ற வளாகம், தூத்துக்குடி' },
        memberCount: 510,
        activeCases: 44,
        phone: '+91 94430 88990',
        email: 'thoothukudi.north@dmk.org.in'
      },
      {
        id: 'tkd-south',
        number: 2,
        name: { en: 'Thoothukudi South', ta: 'தூத்துக்குடி தெற்கு' },
        organizer: { en: 'Adv. R. Paulraj', ta: 'வழக்கறிஞர் ஆர். பால்ராஜ்' },
        court: { en: 'Tiruchendur Sub Court Complex', ta: 'திருச்செந்தூர் சார்சுற்று நீதிமன்றம்' },
        memberCount: 380,
        activeCases: 33,
        phone: '+91 94431 99001',
        email: 'thoothukudi.south@dmk.org.in'
      }
    ]
  },
  {
    id: 'kanniyakumari',
    name: { en: 'Kanniyakumari', ta: 'கன்னியாகுமரி' },
    headquarters: { en: 'Nagercoil', ta: 'நாகர்கோவில்' },
    zone: 'South',
    labelX: 170,
    labelY: 590,
    path: 'M 150,570 L 190,565 L 195,605 L 170,620 L 145,595 Z',
    units: [
      {
        id: 'kk-east',
        number: 1,
        name: { en: 'Kanniyakumari East', ta: 'கன்னியாகுமரி கிழக்கு' },
        organizer: { en: 'Adv. S. Justin Raj', ta: 'வழக்கறிஞர் எஸ். ஜஸ்டின் ராஜ்' },
        court: { en: 'District & Sessions Court, Nagercoil', ta: 'மாவட்ட & அமர்வு நீதிமன்றம், நாகர்கோவில்' },
        memberCount: 470,
        activeCases: 43,
        phone: '+91 94432 00112',
        email: 'kanyakumari.east@dmk.org.in'
      },
      {
        id: 'kk-west',
        number: 2,
        name: { en: 'Kanniyakumari West', ta: 'கன்னியாகுமரி மேற்கு' },
        organizer: { en: 'Adv. T. Vijayakumar', ta: 'வழக்கறிஞர் டி. விஜயகுமார்' },
        court: { en: 'Padmanabhapuram & Kuzhithurai Sub Courts', ta: 'பத்மநாபபுரம் & குழித்துறை நீதிமன்றங்கள்' },
        memberCount: 420,
        activeCases: 39,
        phone: '+91 94433 11223',
        email: 'kanyakumari.west@dmk.org.in'
      }
    ]
  }
];
