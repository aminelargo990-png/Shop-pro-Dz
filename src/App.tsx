import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { 
  Eye, EyeOff, Settings, Plus, QrCode, ShoppingBag, 
  Search, Trash2, Camera, RefreshCw, Facebook, 
  Instagram, ArrowLeft, LogOut, Shield, Globe 
} from 'lucide-react';
import QRCodeStyling from 'qr-code-styling';

// ==========================================
// 1. SUPABASE CLIENT CONFIG
// ==========================================
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==========================================
// 2. TRANSLATION DICTIONARY
// ==========================================
export const translations = {
  fr: {
    appName: "ShopPro DZ",
    shopName: "Nom du magasin",
    phone: "Numéro de téléphone",
    password: "Mot de passe",
    next: "Suivant",
    save: "Enregistrer",
    delete: "Supprimer",
    cancel: "Annuler",
    search: "Rechercher...",
    currency: "DA",
    settings: "Paramètres",
    language: "Langue",
    products: "Produits",
    addProduct: "Ajouter un produit",
    editProduct: "Modifier le produit",
    productName: "Nom du produit",
    price: "Prix",
    barcode: "Code-barres",
    scanBarcode: "Scanner le code-barres",
    uploadError: "Erreur de téléchargement",
    saveSuccess: "Enregistré avec succès !",
    deleteConfirm: "Êtes-vous sûr de vouloir supprimer cet élément ?",
    noProducts: "Aucun produit trouvé",
    adminPanel: "Panneau Admin",
    shopInfo: "Informations du magasin",
    socialLinks: "Liens de réseaux sociaux",
    downloadQR: "Télécharger le QR",
    scanPrompt: "Scannez le code-barres pour voir les détails du produit",
    welcomeTo: "Bienvenue chez",
    loading: "Chargement...",
    logout: "Déconnexion"
  },
  ar: {
    appName: "ShopPro DZ",
    shopName: "اسم المحل",
    phone: "رقم الهاتف",
    password: "كلمة السر",
    next: "التالي",
    save: "حفظ",
    delete: "حذف",
    cancel: "إلغاء",
    search: "بحث...",
    currency: "دج",
    settings: "الإعدادات",
    language: "اللغة",
    products: "المنتجات",
    addProduct: "إضافة منتج",
    editProduct: "تعديل المنتج",
    productName: "اسم المنتج",
    price: "السعر",
    barcode: "الباركود",
    scanBarcode: "قراءة الباركود",
    uploadError: "خطأ في الرفع",
    saveSuccess: "تم الحفظ بنجاح!",
    deleteConfirm: "هل أنت متأكد من الحذف؟",
    noProducts: "لا توجد منتجات",
    adminPanel: "لوحة المدير",
    shopInfo: "معلومات المتجر",
    socialLinks: "روابط التواصل الاجتماعي",
    downloadQR: "تحميل QR",
    scanPrompt: "امسح باركود المنتج لمعرفة التفاصيل",
    welcomeTo: "مرحباً بكم في متجر",
    loading: "جاري التحميل...",
    logout: "تسجيل الخروج"
  }
};

// ==========================================
// 3. GLOBAL APP CONTEXT
// ==========================================
type Lang = 'fr' | 'ar';
interface AppContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations['fr'];
  isRtl: boolean;
  currentMerchant: any | null;
  setCurrentMerchant: (m: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Lang>(() => {
    return (localStorage.getItem('shoppro_lang') as Lang) || 'fr';
  });
  const [currentMerchant, setCurrentMerchant] = useState<any | null>(null);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('shoppro_lang', l);
  };

  const isRtl = lang === 'ar';
  const t = translations[lang];

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang, isRtl]);

  return (
    <AppContext.Provider value={{ lang, setLang, t, isRtl, currentMerchant, setCurrentMerchant }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
// ==========================================
// 4. SHARED LAYOUT COMPONENT
// ==========================================
const Layout: React.FC<{ children: React.ReactNode; showHeader?: boolean }> = ({ children, showHeader = true }) => {
  const { t, setLang, lang } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020813] via-[#09152e] to-[#020813] text-slate-100 flex flex-col font-sans select-none antialiased">
      {showHeader && (
        <header className="border-b border-slate-800 bg-[#040d1f]/80 backdrop-blur-md sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-[#10b981] w-6 h-6" />
            <span className="font-bold text-lg tracking-wide bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              {t.appName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setLang(lang === 'fr' ? 'ar' : 'fr')} 
              className="text-xs bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded border border-slate-700 transition"
            >
              {lang === 'fr' ? 'العربية' : 'Français'}
            </button>
            <button onClick={() => navigate('/settings')} className="text-slate-400 hover:text-[#10b981] transition">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </header>
      )}
      <main className="flex-1 flex flex-col w-full max-w-md mx-auto p-4 pb-20 justify-start">
        {children}
      </main>
    </div>
  );
};

// ==========================================
// 5. PAGES COMPONENTS — PART 1
// ==========================================

// --- PAGE 1: LOGIN ---
export const Login = () => {
  const { t, setCurrentMerchant } = useApp();
  const navigate = useNavigate();
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data, error: fetchError } = await supabase
        .from('merchants')
        .select('*')
        .eq('phone', phone)
        .single();

      if (fetchError || !data) {
        const { data: newMerchant, error: insertError } = await supabase
          .from('merchants')
          .insert([{ shop_name: shopName, phone, password, is_admin: false }])
          .select()
          .single();

        if (insertError) throw insertError;
        setCurrentMerchant(newMerchant);
        navigate('/shop-info');
      } else {
        if (data.password === password) {
          setCurrentMerchant(data);
          if (data.is_admin) {
            navigate('/admin');
          } else {
            navigate('/shop-info');
          }
        } else {
          setError('Password incorrect');
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-[#061329]/60 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6 mt-6">
        <h2 className="text-xl font-bold text-center tracking-tight">{t.appName}</h2>
        <form onSubmit={handleNext} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t.shopName}</label>
            <input type="text" required value={shopName} onChange={e => setShopName(e.target.value)} className="w-full bg-[#030a16] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#10b981] text-white" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t.phone}</label>
            <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-[#030a16] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#10b981] text-white" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t.password}</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-[#030a16] border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#10b981] text-white" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-white">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 text-xs text-center">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-[#10b981] hover:bg-[#0d9668] text-slate-950 font-bold py-3 rounded-xl transition mt-2 shadow-lg flex items-center justify-center">
            {loading ? t.loading : t.next}
          </button>
        </form>
      </div>
    </Layout>
  );
};
// --- PAGE 2: Magasin Info ---
export const ShopInfo = () => {
  const { t, currentMerchant, setCurrentMerchant } = useApp();
  const navigate = useNavigate();
  const [logoPreview, setLogoPreview] = useState<string | null>(currentMerchant?.logo_url || null);
  const [tiktok, setTiktok] = useState(currentMerchant?.tiktok_url || '');
  const [instagram, setInstagram] = useState(currentMerchant?.instagram_url || '');
  const [facebook, setFacebook] = useState(currentMerchant?.facebook_url || '');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    if (!currentMerchant) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('merchants')
        .update({ logo_url: logoPreview, tiktok_url: tiktok, instagram_url: instagram, facebook_url: facebook })
        .eq('id', currentMerchant.id);
      if (error) throw error;
      setCurrentMerchant({ ...currentMerchant, logo_url: logoPreview, tiktok_url: tiktok, instagram_url: instagram, facebook_url: facebook });
      navigate('/shop-qr');
    } catch (err) {
      alert(t.uploadError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-[#061329]/60 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-5">
        <h2 className="text-lg font-bold tracking-tight text-white">{t.shopInfo}</h2>
        <div className="space-y-2">
          <label className="block text-xs text-slate-400">{t.logo}</label>
          <div className="flex flex-col items-center gap-3 p-4 border border-dashed border-slate-800 rounded-xl bg-[#030a16]">
            {logoPreview ? (
              <img src={logoPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-2 border-[#10b981]" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500"><Camera className="w-8 h-8" /></div>
            )}
            <input type="file" accept="image/*" onChange={handleImageChange} className="text-xs text-slate-400 file:bg-slate-800 file:text-white file:border-0 file:py-1.5 file:px-3 file:rounded-lg cursor-pointer" />
          </div>
        </div>
        <div className="space-y-3">
          <label className="block text-xs text-slate-400">{t.socialLinks}</label>
          <input type="text" placeholder="Facebook" value={facebook} onChange={e => setFacebook(e.target.value)} className="w-full bg-[#030a16] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10b981]" />
          <input type="text" placeholder="Instagram" value={instagram} onChange={e => setInstagram(e.target.value)} className="w-full bg-[#030a16] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10b981]" />
          <input type="text" placeholder="TikTok" value={tiktok} onChange={e => setTiktok(e.target.value)} className="w-full bg-[#030a16] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#10b981]" />
        </div>
        <button onClick={handleSave} disabled={loading} className="w-full bg-[#10b981] hover:bg-[#0d9668] text-slate-950 font-bold py-3 rounded-xl transition shadow-lg flex items-center justify-center">
          {loading ? t.loading : t.next}
        </button>
      </div>
    </Layout>
  );
};

// --- PAGE 3: SHOP QR CODE ---
export const ShopQR = () => {
  const { t, currentMerchant } = useApp();
  const navigate = useNavigate();
  const qrRef = React.useRef<HTMLDivElement>(null);
  const shopUrl = `${window.location.origin}/customer/shop/${currentMerchant?.id || 'test-id'}`;

  useEffect(() => {
    if (qrRef.current) {
      qrRef.current.innerHTML = "";
      const qrCode = new QRCodeStyling({
        width: 220,
        height: 220,
        data: shopUrl,
        dotsOptions: { color: "#10b981", type: "rounded" },
        backgroundOptions: { color: "#030a16" },
        cornersSquareOptions: { type: "extra-rounded", color: "#ffffff" }
      });
      qrCode.append(qrRef.current);
    }
  }, [shopUrl]);

  const downloadQr = () => {
    const qrCode = new QRCodeStyling({ width: 500, height: 500, data: shopUrl, dotsOptions: { color: "#10b981", type: "rounded" }, backgroundOptions: { color: "#030a16" } });
    qrCode.download({ name: "shoppro-qr", extension: "png" });
  };

  return (
    <Layout>
      <div className="bg-[#061329]/60 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 shadow-xl text-center space-y-6">
        <h2 className="text-lg font-bold tracking-tight text-white">{t.appName} - QR Code</h2>
        <div className="flex justify-center p-4 bg-[#030a16] border border-slate-800 rounded-2xl w-fit mx-auto" ref={qrRef}></div>
        <div className="flex flex-col gap-2">
          <button onClick={downloadQr} className="w-full bg-[#10b981]/10 hover:bg-[#10b981]/20 border border-[#10b981]/30 text-[#10b981] font-medium py-3 rounded-xl transition">
            {t.downloadQR}
          </button>
          <button onClick={() => navigate('/add-product')} className="w-full bg-[#10b981] hover:bg-[#0d9668] text-slate-950 font-bold py-3 rounded-xl transition shadow-lg">
            {t.next}
          </button>
        </div>
      </div>
    </Layout>
  );
};
// --- PAGE 4: ADD PRODUCT ---
export const AddProduct = () => {
  const { t, currentMerchant } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [barcode, setBarcode] = useState('');
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImgPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMerchant) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('products')
        .insert([{ merchant_id: currentMerchant.id, name, price: parseFloat(price), barcode, image_url: imgPreview }]);
      if (error) throw error;
      setName(''); setPrice(''); setBarcode(''); setImgPreview(null);
      alert(t.saveSuccess);
    } catch (err: any) {
      alert(err.message || t.uploadError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-[#061329]/60 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold tracking-tight text-white">{t.addProduct}</h2>
          <button onClick={() => navigate('/products')} className="text-xs text-[#10b981] bg-[#10b981]/10 px-3 py-1.5 rounded-lg border border-[#10b981]/20 hover:bg-[#10b981]/20 transition">
            {t.products}
          </button>
        </div>
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t.productName}</label>
            <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#030a16] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10b981]" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t.price}</label>
            <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-[#030a16] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10b981]" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">{t.barcode}</label>
            <input type="text" required value={barcode} onChange={e => setBarcode(e.target.value)} className="w-full bg-[#030a16] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#10b981]" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-col items-center gap-3 p-4 border border-dashed border-slate-800 rounded-xl bg-[#030a16]">
              {imgPreview && <img src={imgPreview} alt="Preview" className="w-full h-32 object-cover rounded-xl border border-slate-800" />}
              <input type="file" accept="image/*" onChange={handleImage} className="text-xs text-slate-400 file:bg-slate-800 file:text-white file:border-0 file:py-1.5 file:px-3 file:rounded-lg cursor-pointer" />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#10b981] hover:bg-[#0d9668] text-slate-950 font-bold py-3 rounded-xl transition shadow-lg flex items-center justify-center">
            {loading ? t.loading : t.save}
          </button>
        </form>
      </div>
    </Layout>
  );
};

// --- PRODUCTS LIST (A-Z) ---
export const ProductsList = () => {
  const { t, currentMerchant } = useApp();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (currentMerchant) {
      supabase.from('products').select('*').eq('merchant_id', currentMerchant.id).order('name', { ascending: true }).then(({ data }) => { if (data) setProducts(data); });
    }
  }, [currentMerchant]);

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.barcode.includes(search));

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 bg-[#061329]/80 border border-slate-800 rounded-xl text-slate-400 hover:text-white"><ArrowLeft className="w-4 h-4" /></button>
          <h2 className="text-lg font-bold text-white">{t.products}</h2>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3.5 w-4 h-4 text-slate-500" />
          <input type="text" placeholder={t.search} value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-[#061329]/60 border border-slate-800 rounded-xl pl-9 pr-4 py-3 text-sm text-white focus:outline-none focus:border-[#10b981]" />
        </div>
        <div className="space-y-2">
          {filtered.map(p => (
            <div key={p.id} onClick={() => navigate(`/edit-product/${p.id}`)} className="flex items-center justify-between p-3 bg-[#061329]/40 border border-slate-800/60 rounded-xl hover:border-[#10b981]/40 transition cursor-pointer">
              <div className="flex items-center gap-3">
                {p.image_url ? <img src={p.image_url} alt="" className="w-12 h-12 rounded-lg object-cover border border-slate-800" /> : <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center text-slate-600"><ShoppingBag className="w-5 h-5" /></div>}
                <div>
                  <h4 className="font-medium text-sm text-white">{p.name}</h4>
                  <p className="text-xs text-slate-500">{p.barcode}</p>
                </div>
              </div>
              <span className="font-bold text-sm text-[#10b981]">{p.price} {t.currency}</span>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-xs text-slate-500 text-center py-6">{t.noProducts}</p>}
        </div>
      </div>
    </Layout>
  );
};
// --- EDIT/DELETE PRODUCT ---
export const EditProduct = () => {
  const { id } = useParams();
  const { t } = useApp();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [barcode, setBarcode] = useState('');
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  useEffect(() => {
    supabase.from('products').select('*').eq('id', id).single().then(({ data }) => {
      if (data) { setName(data.name); setPrice(data.price.toString()); setBarcode(data.barcode); setImgPreview(data.image_url); }
    });
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('products').update({ name, price: parseFloat(price), barcode, image_url: imgPreview }).eq('id', id);
    navigate('/products');
  };

  const handleDelete = async () => {
    if (confirm(t.deleteConfirm)) { await supabase.from('products').delete().eq('id', id); navigate('/products'); }
  };

  return (
    <Layout>
      <div className="bg-[#061329]/60 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3 mb-2">
          <button type="button" onClick={() => navigate('/products')} className="p-2 bg-[#030a16] border border-slate-800 rounded-xl text-slate-400"><ArrowLeft className="w-4 h-4" /></button>
          <h2 className="text-lg font-bold text-white">{t.editProduct}</h2>
        </div>
        <form onSubmit={handleUpdate} className="space-y-4">
          <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#030a16] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white" />
          <input type="number" step="0.01" required value={price} onChange={e => setPrice(e.target.value)} className="w-full bg-[#030a16] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white" />
          <input type="text" required value={barcode} onChange={e => setBarcode(e.target.value)} className="w-full bg-[#030a16] border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white" />
          <div className="flex gap-2 pt-2">
            <button type="button" onClick={handleDelete} className="flex-1 bg-red-500/10 border border-red-500/20 text-red-400 py-2.5 rounded-xl text-sm font-medium"><Trash2 className="w-4 h-4 mx-auto" /></button>
            <button type="submit" className="flex-1 bg-[#10b981] text-slate-950 font-bold py-2.5 rounded-xl text-sm shadow-md">{t.save}</button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

// --- CONFIG PAGE & GLOBAL LOGOUT ---
export const SettingsPage = () => {
  const { t, lang, setLang, currentMerchant, setCurrentMerchant } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    setCurrentMerchant(null);
    navigate('/');
  };

  return (
    <Layout>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 bg-[#061329]/80 border border-slate-800 rounded-xl text-slate-400"><ArrowLeft className="w-4 h-4" /></button>
          <h2 className="text-lg font-bold text-white">{t.settings}</h2>
        </div>
        <div className="bg-[#061329]/60 border border-slate-800/80 rounded-2xl p-5 shadow-xl space-y-5">
          {currentMerchant?.is_admin && <div className="bg-[#10b981]/10 border border-[#10b981]/20 rounded-xl p-3 text-xs text-[#10b981] font-medium flex items-center gap-2"><Shield className="w-4 h-4" />{t.adminPanel}</div>}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">{t.language}</label>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setLang('fr')} className={`p-2.5 rounded-xl border text-xs font-medium transition ${lang === 'fr' ? 'bg-[#10b981]/10 border-[#10b981] text-[#10b981]' : 'bg-[#030a16] border-slate-800 text-slate-400'}`}>Français</button>
              <button onClick={() => setLang('ar')} className={`p-2.5 rounded-xl border text-xs font-medium transition ${lang === 'ar' ? 'bg-[#10b981]/10 border-[#10b981] text-[#10b981]' : 'bg-[#030a16] border-slate-800 text-slate-400'}`}>العربية</button>
            </div>
          </div>
          <hr className="border-slate-800/80" />
          <button onClick={handleLogout} className="w-full bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition"><LogOut className="w-4 h-4" />{t.logout}</button>
        </div>
      </div>
    </Layout>
  );
};

// --- PANEL ADMIN ---
export const AdminPanel = () => {
  const { t } = useApp();
  const [merchants, setMerchants] = useState<any>([]);

  useEffect(() => {
    supabase.from('merchants').select('*').eq('is_admin', false).then(({ data }) => { if (data) setMerchants(data); });
  }, []);

  return (
    <Layout>
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">{t.adminPanel}</h2>
        <div className="space-y-2">
          {merchants.map((m: any) => (
            <div key={m.id} className="p-3 bg-[#061329]/40 border border-slate-800 rounded-xl flex justify-between items-center">
              <div>
                <h4 className="font-medium text-sm text-white">{m.shop_name}</h4>
                <p className="text-xs text-slate-500">{m.phone}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

// --- CLIENT SIDE CUSTOMER SHOP ---
export const CustomerShop = () => {
  const { id } = useParams();
  const { t } = useApp();
  const [merchant, setMerchant] = useState<any | null>(null);
  const [barcodeSearch, setBarcodeSearch] = useState('');
  const [scannedProduct, setScannedProduct] = useState<any | null>(null);

  useEffect(() => {
    supabase.from('merchants').select('*').eq('id', id).single().then(({ data }) => { if (data) setMerchant(data); });
  }, [id]);

  const handleSearchProduct = async () => {
    if (!id || !barcodeSearch) return;
    const { data } = await supabase.from('products').select('*').eq('merchant_id', id).eq('barcode', barcodeSearch).single();
    setScannedProduct(data || null);
  };

  return (
    <Layout showHeader={false}>
      <div className="space-y-6 pt-4">
        {merchant && (
          <div className="text-center space-y-2">
            {merchant.logo_url && <img src={merchant.logo_url} alt="" className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-[#10b981]" />}
            <h1 className="text-xl font-bold text-white">{t.welcomeTo} {merchant.shop_name}</h1>
            <div className="flex justify-center gap-3 text-slate-400">
              {merchant.facebook_url && <a href={merchant.facebook_url}><Facebook className="w-5 h-5" /></a>}
              {merchant.instagram_url && <a href={merchant.instagram_url}><Instagram className="w-5 h-5" /></a>}
            </div>
          </div>
        )}
        <div className="bg-[#061329]/60 border border-slate-800 rounded-2xl p-4 space-y-4">
          <p className="text-xs text-slate-400 text-center">{t.scanPrompt}</p>
          <div className="flex gap-2">
            <input type="text" value={barcodeSearch} onChange={e => setBarcodeSearch(e.target.value)} placeholder={t.barcode} className="flex-1 bg-[#030a16] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white" />
            <button onClick={handleSearchProduct} className="bg-[#10b981] text-slate-950 font-bold px-4 rounded-xl text-sm">{t.search}</button>
          </div>
        </div>
        {scannedProduct ? (
          <div className="bg-gradient-to-b from-[#0a1d3a] to-[#061329] border border-[#10b981]/30 rounded-2xl p-4 space-y-4 shadow-lg">
            {scannedProduct.image_url && <img src={scannedProduct.image_url} alt="" className="w-full h-40 object-cover rounded-xl" />}
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-white">{scannedProduct.name}</h3>
              <span className="text-xl font-black text-[#10b981]">{scannedProduct.price} {t.currency}</span>
            </div>
          </div>
        ) : barcodeSearch && (
          <p className="text-xs text-slate-500 text-center py-6">{t.noProducts}</p>
        )}
      </div>
    </Layout>
  );
};

// ==========================================
// 6. MAIN APPLICATION ENTRY AND ROUTING
// ==========================================
export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/shop-info" element={<ShopInfo />} />
          <Route path="/shop-qr" element={<ShopQR />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/products" element={<ProductsList />} />
          <Route path="/edit-product/:id" element={<EditProduct />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/customer/shop/:id" element={<CustomerShop />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
