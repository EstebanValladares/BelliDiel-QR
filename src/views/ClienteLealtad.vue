<script setup>
import { ref } from 'vue'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'

import logoImage from '../assets/logo.jpg'
import premio5 from '../assets/5cafes.jpg'
import premio10 from '../assets/10cafes.jpg'

const telefono = ref('')
const cafesComprados = ref(null)
const error = ref('')
const cargando = ref(false)

const consultarLealtad = async () => {
  if (telefono.value.length < 10) {
    error.value = 'Ingresa tu número a 10 dígitos.'
    cafesComprados.value = null
    return
  }

  cargando.value = true
  error.value = ''
  
  try {
    const clienteRef = doc(db, 'clientes', telefono.value)
    const clienteSnap = await getDoc(clienteRef)

    if (clienteSnap.exists()) {
      cafesComprados.value = clienteSnap.data().cafes_comprados
    } else {
      error.value = 'Número no encontrado. ¡Regístrate en caja en tu próxima visita!'
      cafesComprados.value = null
    }
  } catch (err) {
    console.error("Error consultando Firebase:", err)
    error.value = 'Error de conexión. Intenta de nuevo.'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="mobile-container">
    <nav class="top-bar">
      <router-link to="/" class="back-button">
        <span class="chevron">❮</span> Volver al menú
      </router-link>
    </nav>

    <header class="poster-header">
      <div class="bg-shape shape-1"></div>
      <div class="bg-shape shape-2"></div>
      <div class="coffee-beans-pattern"></div>

      <div class="floating-text left-text">
        Pequeños<br>Momentos<br>Grandes<br>Historias
        <span class="heart-icon">♥</span>
      </div>
      <div class="floating-text right-text">
        Un buen café<br>siempre es<br>mejor contigo
        <span class="heart-icon">♥</span>
      </div>

      <div class="logo-wrapper">
        <img :src="logoImage" alt="BelliDiel Coffee" class="logo" />
      </div>
      <p class="subtitle-logo">CAFÉ, CREPAS Y MÁS</p>

      <div class="main-title-container">
        <h1 class="title-3d">Tu lealtad</h1>
        <h2 class="subtitle-3d">tiene premio ♡</h2>
        
        <div class="brush-stroke">
          <p class="slogan-cursive">¡Disfruta, acumula y gana!</p>
        </div>
      </div>
    </header>

    <main class="loyalty-card">
      <div class="input-group">
        <input 
          id="phone"
          v-model="telefono" 
          type="tel" 
          maxlength="10" 
          placeholder="Ingresa tu WhatsApp"
          @keyup.enter="consultarLealtad"
          class="phone-input"
        />
        <button @click="consultarLealtad" class="search-button" :disabled="cargando">
          {{ cargando ? 'Buscando...' : 'Ver mis sellos' }}
        </button>
      </div>

      <div v-if="error" class="error-msg">
        ⚠️ {{ error }}
      </div>

      <div v-if="cafesComprados !== null" class="stamp-card slide-up">
        
        <div class="stamp-section">
          <div class="cups-grid">
            <div 
              v-for="n in 5" 
              :key="n" 
              class="cup-slot"
              :class="{ 'is-stamped': n <= cafesComprados }"
            >
              <span v-if="n <= cafesComprados" class="check-mark">✅</span>
              <span v-else class="cup-number">{{ n }}</span>
            </div>
          </div>
          <div class="reward-preview">
            <div class="reward-text-box">En la compra<br>del 5to café</div>
            <img :src="premio5" alt="Cantarindo" class="reward-img" />
          </div>
        </div>

        <hr class="divider" />

        <div class="stamp-section">
          <div class="cups-grid">
            <div 
              v-for="n in 5" 
              :key="n + 5" 
              class="cup-slot"
              :class="{ 'is-stamped': (n + 5) <= cafesComprados }"
            >
              <span v-if="(n + 5) <= cafesComprados" class="check-mark">✅</span>
              <span v-else class="cup-number">{{ n + 5 }}</span>
            </div>
          </div>
          <div class="reward-preview">
            <div class="reward-text-box">En la compra<br>del 10mo café</div>
            <img :src="premio10" alt="Bebidas Gratis" class="reward-img" />
          </div>
        </div>

        <p v-if="cafesComprados >= 10" class="congrats-text">
          ¡Felicidades! Tienes una bebida gratis esperándote. 🎉
        </p>

      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Chewy&family=Montserrat:wght@600;800&display=swap');

.mobile-container {
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 0.5rem 1rem 2rem 1rem;
  background: linear-gradient(135deg, #fdf6ec 0%, #f7ebd0 100%);
  color: #3e2723;
  box-sizing: border-box;
  font-family: 'Montserrat', sans-serif;
  overflow-x: hidden;
  position: relative;
}

.coffee-beans-pattern {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(#d1b8a5 0.85px, transparent 0.85px), radial-gradient(#d1b8a5 0.85px, #fdf6ec 0.85px);
  background-size: 34px 34px;
  background-position: 0 0, 17px 17px;
  opacity: 0.25;
  pointer-events: none;
  z-index: 0;
}

.top-bar {
  display: flex;
  align-items: center;
  height: 40px;
  margin-bottom: 0.2rem;
  z-index: 10;
  position: relative;
}

.back-button {
  display: flex;
  align-items: center;
  color: #4a2c20;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.6);
  padding: 4px 10px;
  border-radius: 8px;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
}

.poster-header {
  position: relative;
  text-align: center;
  padding: 0.5rem 0 1.5rem 0;
  margin-bottom: 0.5rem;
  z-index: 1;
}

.bg-shape {
  position: absolute;
  top: -40px;
  width: 35vw;
  max-width: 130px;
  height: 80px;
  border-radius: 50%;
  z-index: 0;
  filter: blur(1px);
}
.shape-1 {
  background-color: #e2cbb8;
  left: -20px;
  transform: rotate(-20deg);
}
.shape-2 {
  background-color: #6b4431;
  right: -20px;
  top: -10px;
  width: 25vw;
  max-width: 100px;
  height: 70px;
  transform: rotate(15deg);
  opacity: 0.85;
}

.floating-text {
  position: absolute;
  font-family: 'Caveat', cursive;
  font-size: clamp(1.7rem, 4vw, 3rem);
  line-height: 1.05;
  color: #2b170e;
  z-index: 2;
  text-align: center;
  width: 130px;
  font-weight: bold;
  text-shadow: 0 2px 4px rgba(253, 246, 236, 0.8);
}

.left-text {
  top: 10px;
  left: -8px;
  transform: rotate(-10deg);
}

.right-text {
  top: 10px;
  right: -10px;
  transform: rotate(6deg);
}

.heart-icon, .bean-icon {
  display: inline-block;
  font-size: 1rem;
  color: #c86d51;
}

.logo-wrapper {
  position: relative;
  width: 84px;
  height: 84px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #ffffff;
  background: white;
  z-index: 2;
  box-shadow: 0 6px 15px rgba(62, 39, 35, 0.12);
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.subtitle-logo {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.65rem;
  font-weight: 800;
  letter-spacing: 2.5px;
  color: #5c3a2e;
  margin: 8px 0 15px 0;
  position: relative;
  z-index: 2;
}

.main-title-container {
  position: relative;
  z-index: 2;
}

.title-3d, .subtitle-3d {
  font-family: 'Chewy', cursive;
  color: #3e1f13;
  margin: 0;
  line-height: 0.85;
  text-shadow: 
    -3px -3px 0 #fff, 3px -3px 0 #fff, 
    -3px 3px 0 #fff, 3px 3px 0 #fff,
    -3px 0 0 #fff, 3px 0 0 #fff, 
    0 -3px 0 #fff, 0 3px 0 #fff,
    0px 8px 16px rgba(62, 31, 19, 0.12);
  transform: rotate(-3deg);
}

.title-3d {
  font-size: clamp(3.2rem, 14vw, 4.4rem);
}

.subtitle-3d {
  font-size: clamp(2rem, 9vw, 2.7rem);
  margin-top: -2px;
}

.brush-stroke {
  background-color: #f7cac9;
  display: inline-block;
  padding: 5px 18px;
  border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
  margin-top: 12px;
  transform: rotate(-2deg);
  box-shadow: 0 4px 10px rgba(247, 202, 201, 0.5);
}

.slogan-cursive {
  font-family: 'Caveat', cursive;
  font-size: clamp(1.25rem, 4.5vw, 1.5rem);
  color: #3e1f13;
  margin: 0;
  font-weight: 700;
}

.loyalty-card {
  position: relative;
  z-index: 2;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 0.8rem;
}

.phone-input {
  width: 100%;
  padding: 0.9rem;
  border: 2px solid #e0d0c0;
  border-radius: 14px;
  font-size: 1.1rem;
  text-align: center;
  background-color: rgba(255, 255, 255, 0.9);
  color: #4a2c20;
  font-family: 'Montserrat', sans-serif;
  font-weight: 700;
  outline: none;
  box-sizing: border-box;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
  transition: all 0.3s ease;
}

.phone-input:focus {
  border-color: #4a2c20;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(74, 44, 32, 0.15);
}

.search-button {
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(135deg, #4a2c20 0%, #3e1f13 100%);
  color: white;
  border: none;
  border-radius: 14px;
  font-size: 1rem;
  font-family: 'Montserrat', sans-serif;
  font-weight: 800;
  cursor: pointer;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(62, 31, 19, 0.2);
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.search-button:active {
  transform: scale(0.98);
}

.stamp-card {
  background-color: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  border: 2px solid #ecdcd0;
  border-radius: 20px;
  padding: 1.4rem 0.8rem;
  margin-top: 1rem;
  box-shadow: 0 10px 30px rgba(62, 39, 35, 0.08);
}

.stamp-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 0.8rem;
}

.cups-grid {
  display: flex;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 0.8rem;
  width: 100%;
  max-width: 350px;
}

.cup-slot {
  flex: 1;
  height: 52px;
  background-color: #fffaf5;
  border: 2px solid #5d3a29;
  border-radius: 6px 6px 14px 14px; 
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  box-shadow: inset 0 -4px 0 rgba(0,0,0,0.04), 0 3px 6px rgba(0,0,0,0.02);
  transition: all 0.3s ease;
}

.cup-slot.is-stamped {
  background-color: #e8f5e9;
  border-color: #2e7d32;
  box-shadow: inset 0 -4px 0 rgba(46, 125, 50, 0.1), 0 3px 8px rgba(46, 125, 50, 0.15);
}

.cup-number {
  font-family: 'Montserrat', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  color: #5d3a29;
}

.check-mark {
  font-size: 1.3rem;
  animation: popIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.reward-preview {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fcf8f2;
  padding: 8px 12px;
  border-radius: 14px;
  width: 100%;
  max-width: 330px;
  border: 2px dashed #d96c4e;
  box-sizing: border-box;
  box-shadow: 0 4px 10px rgba(0,0,0,0.03);
}

.reward-text-box {
  background-color: #4a2c20;
  color: white;
  padding: 5px 10px;
  border-radius: 8px;
  font-family: 'Caveat', cursive;
  font-weight: 700;
  text-align: center;
  transform: rotate(-2deg);
  font-size: 1.15rem;
  line-height: 1;
}

.reward-img {
  height: 65px;
  width: auto;
  border-radius: 8px;
  object-fit: contain;
  box-shadow: 0 2px 6px rgba(0,0,0,0.08);
}

.divider {
  border: 0;
  border-top: 2px dashed #e2cbb8;
  margin: 1.2rem 0;
}

.congrats-text {
  text-align: center;
  color: #2e7d32;
  font-weight: 800;
  font-size: 1.05rem;
  margin-top: 0.8rem;
  padding: 0 0.5rem;
  background-color: #e8f5e9;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #c8e6c9;
}

.error-msg {
  color: #c62828;
  text-align: center;
  font-weight: 600;
  margin-top: 10px;
  font-size: 0.95rem;
  background-color: #ffebee;
  padding: 8px;
  border-radius: 10px;
  border: 1px solid #ffcdd2;
}

.slide-up { animation: slideUp 0.4s ease forwards; }
@keyframes popIn {
  0% { transform: scale(0); }
  80% { transform: scale(1.2); }
  100% { transform: scale(1); }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}


@media (max-width: 360px) {
  .floating-text {
    font-size: 1rem;
    width: 90px;
  }
  .cup-slot {
    height: 46px;
  }
  .cup-number {
    font-size: 0.9rem;
  }
}
</style>