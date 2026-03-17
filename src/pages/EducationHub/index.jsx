import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Search, BookOpen, Scale, MessageSquare, PlayCircle, Square, Clock, ChevronRight, X } from 'lucide-react';
import { useHaptics } from '../../hooks/useHaptics';
import { useAccessibilityStore } from '../../contexts/useAccessibilityStore';
import { EDUCATION_CATEGORIES, EDUCATION_RESOURCES } from '../../services/mockData';

export default function EducationHub() {
  const navigate = useNavigate();
  const { tap } = useHaptics();
  const { speak, stopSpeaking } = useAccessibilityStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isReading, setIsReading] = useState(false);

  const filteredResources = useMemo(() => {
    return EDUCATION_RESOURCES.filter(res => {
      const matchesCategory = activeCategory === 'all' || res.category === activeCategory;
      const matchesSearch = res.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            res.summary.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, activeCategory]);

  const handleReadArticle = (article) => {
    tap();
    if (isReading) {
      stopSpeaking();
      setIsReading(false);
    } else {
      setIsReading(true);
      speak(`${article.title}. ${article.content}`, { 
        onEnd: () => setIsReading(false) 
      });
    }
  };

  const handleCloseArticle = () => {
    tap();
    stopSpeaking();
    setIsReading(false);
    setSelectedArticle(null);
  };

  return (
    <div style={{ background: 'var(--clr-bg)', minHeight: '100dvh', paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ 
        background: 'linear-gradient(135deg, var(--clr-primary) 0%, var(--clr-primary-dark) 100%)',
        padding: 'var(--sp-8) var(--sp-4) var(--sp-12)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => { tap(); navigate(-1); }}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', marginBottom: 'var(--sp-4)'
          }}
        >
          <ArrowLeft size={20} color="#fff" />
        </motion.button>
        
        <h1 style={{ fontSize: 'var(--fs-3xl)', fontWeight: 'var(--fw-extrabold)', marginBottom: 8 }}>
          Education Hub
        </h1>
        <p style={{ fontSize: 'var(--fs-base)', opacity: 0.9, maxWidth: 400 }}>
          Empowering you with knowledge about your healthcare rights and self-advocacy tools.
        </p>

        {/* Search Bar */}
        <div style={{ position: 'relative', marginTop: 'var(--sp-6)', maxWidth: 500 }}>
          <Search size={18} color="rgba(255,255,255,0.6)" style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search resources..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 48px',
              borderRadius: 'var(--r-xl)',
              border: 'none',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              fontSize: 'var(--fs-base)',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ marginTop: -30, padding: '0 var(--sp-4)' }}>
        {/* Categories */}
        <div style={{ 
          display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 10, 
          scrollbarWidth: 'none', position: 'relative', zIndex: 10 
        }}>
          <button
            onClick={() => { tap(); setActiveCategory('all'); }}
            style={{
              padding: '10px 20px', borderRadius: 'var(--r-lg)',
              background: activeCategory === 'all' ? 'var(--clr-secondary)' : '#fff',
              color: activeCategory === 'all' ? '#fff' : 'var(--clr-text-primary)',
              border: 'none', boxShadow: 'var(--shadow-md)',
              fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-sm)',
              cursor: 'pointer', whiteSpace: 'nowrap'
            }}
          >
            All Resources
          </button>
          {EDUCATION_CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { tap(); setActiveCategory(cat.id); }}
              style={{
                padding: '10px 20px', borderRadius: 'var(--r-lg)',
                background: activeCategory === cat.id ? 'var(--clr-secondary)' : '#fff',
                color: activeCategory === cat.id ? '#fff' : 'var(--clr-text-primary)',
                border: 'none', boxShadow: 'var(--shadow-md)',
                fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-sm)',
                cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6
              }}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div style={{ marginTop: 'var(--sp-6)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--sp-4)' }}>
          {filteredResources.map((res) => (
            <motion.div
              layoutId={res.id}
              key={res.id}
              onClick={() => { tap(); setSelectedArticle(res); speak(`Reviewing ${res.title}. Tap read aloud to hear the full content.`); }}
              style={{
                background: '#fff', borderRadius: 'var(--r-xl)',
                padding: 'var(--sp-5)', border: '1px solid var(--clr-border)',
                cursor: 'pointer', boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ 
                  padding: '4px 10px', borderRadius: 'var(--r-full)', 
                  background: 'var(--clr-primary-light)', color: 'var(--clr-primary)',
                  fontSize: 10, fontWeight: 'var(--fw-bold)', textTransform: 'uppercase'
                }}>
                  {res.category}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--clr-text-muted)', fontSize: 10 }}>
                  <Clock size={12} /> {res.readTime}
                </div>
              </div>
              <h3 style={{ fontSize: 'var(--fs-lg)', fontWeight: 'var(--fw-bold)', color: 'var(--clr-text-primary)', marginBottom: 8 }}>
                {res.title}
              </h3>
              <p style={{ fontSize: 'var(--fs-sm)', color: 'var(--clr-text-secondary)', lineHeight: 'var(--lh-relaxed)', marginBottom: 16 }}>
                {res.summary}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--clr-primary)', fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-sm)' }}>
                Read Article <ChevronRight size={16} />
              </div>
            </motion.div>
          ))}
        </div>

        {filteredResources.length === 0 && (
          <div style={{ textAlign: 'center', padding: 'var(--sp-12) var(--sp-4)', color: 'var(--clr-text-muted)' }}>
            <p style={{ fontSize: 48, marginBottom: 16 }}>📚</p>
            <h3>No resources found</h3>
            <p>Try searching for different keywords or categories.</p>
          </div>
        )}
      </div>

      {/* Article Modal Overlay */}
      <AnimatePresence>
        {selectedArticle && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseArticle}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, backdropFilter: 'blur(4px)' }}
            />
            <motion.div
              layoutId={selectedArticle.id}
              style={{
                position: 'fixed', bottom: 0, left: 0, right: 0, top: 20,
                background: '#fff', borderRadius: '24px 24px 0 0',
                zIndex: 1001, overflowY: 'auto',
                display: 'flex', flexDirection: 'column'
              }}
            >
              {/* Modal Header */}
              <div style={{ position: 'sticky', top: 0, background: '#fff', padding: '16px 20px', borderBottom: '1px solid var(--clr-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <button
                    onClick={handleCloseArticle}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                  >
                    <ArrowLeft size={24} color="var(--clr-text-primary)" />
                  </button>
                  <h2 style={{ fontSize: 'var(--fs-base)', fontWeight: 'var(--fw-bold)' }}>Article</h2>
                </div>
                <button
                  onClick={() => handleReadArticle(selectedArticle)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 16px', borderRadius: 'var(--r-full)',
                    background: isReading ? 'var(--clr-primary)' : 'var(--clr-primary-light)',
                    color: isReading ? '#fff' : 'var(--clr-primary)',
                    border: 'none', cursor: 'pointer', fontWeight: 'var(--fw-bold)', fontSize: 'var(--fs-sm)'
                  }}
                >
                  {isReading ? <><Square size={16} fill="#fff" /> Stop</> : <><PlayCircle size={16} /> Read Aloud</>}
                </button>
              </div>

              {/* Modal Content */}
              <div style={{ padding: '30px 20px', flex: 1 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  {selectedArticle.tags.map(tag => (
                    <span key={tag} style={{ 
                      fontSize: 'var(--fs-xs)', background: 'var(--clr-bg-secondary)', 
                      padding: '4px 12px', borderRadius: 'var(--r-md)', color: 'var(--clr-text-muted)'
                    }}>
                      #{tag}
                    </span>
                  ))}
                </div>
                <h1 style={{ fontSize: 'var(--fs-2xl)', fontWeight: 'var(--fw-extrabold)', color: 'var(--clr-text-primary)', marginBottom: 20, lineHeight: 'var(--lh-tight)' }}>
                  {selectedArticle.title}
                </h1>
                <div style={{ 
                  fontSize: 'var(--fs-base)', color: 'var(--clr-text-secondary)', 
                  lineHeight: 'var(--lh-relaxed)', whiteSpace: 'pre-wrap'
                }}>
                  {selectedArticle.content}
                </div>
              </div>
              
              {/* Modal Footer Actions */}
              <div style={{ padding: 20, borderTop: '1px solid var(--clr-border)', display: 'flex', gap: 12 }}>
                <button style={{ 
                  flex: 1, padding: 14, borderRadius: 'var(--r-lg)', 
                  background: 'var(--clr-primary)', color: '#fff', 
                  border: 'none', fontWeight: 'var(--fw-bold)', cursor: 'pointer' 
                }}>
                  Share This Article
                </button>
                <button 
                  onClick={handleCloseArticle}
                  style={{ 
                    flex: 1, padding: 14, borderRadius: 'var(--r-lg)', 
                    background: 'var(--clr-bg-secondary)', color: 'var(--clr-text-primary)', 
                    border: 'none', fontWeight: 'var(--fw-bold)', cursor: 'pointer' 
                  }}
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
