<template>
  <div class="loyalty-container">
    
    <router-link to="/" class="floating-back-btn">
      <span class="chevron">❮</span> Menú
    </router-link>

    <header class="header">
      <img :src="logoImage" alt="BelliDiel Coffee Logo" class="brand-logo" />
      <h1 class="brand-title">MIS CAFES☕</h1>
      <p class="brand-subtitle">Ingresa tu número para ver tus recompensas</p>
      <p class="brand-subtitle2">VALIDO HASTA EL 30 DE OCTUBRE DEL 2026</p>
    </header>

    <div class="search-section">
      <input 
        v-model="telefono" 
        type="tel" 
        maxlength="10"
        placeholder="Ingresa tu WhatsApp (10 dígitos)" 
        class="phone-input"
        @keyup.enter="buscarUsuario"
        :disabled="cargando"
      />
      <button @click="buscarUsuario" class="btn-search" :disabled="cargando">
        {{ cargando ? 'Buscando...' : 'Ver mis cafés' }}
      </button>
    </div>

    <transition name="fade">
      <div v-if="toastMessage" class="toast">
        {{ toastMessage }}
      </div>
    </transition>

    <transition name="slide-up">
      <div v-if="cafesComprados !== null" class="results-section">
        
        <div class="status-card">
          <h2>Tus cafés acumulados</h2>
          <span class="coffee-count">{{ cafesComprados }} / 10</span>
          
          <div class="cups-grid">
            <div v-for="n in (cafesComprados > 10 ? 10 : cafesComprados)" :key="n" class="cup-item fade-in-staggered">
              <img :src="vasoCafe" alt="Café Comprado" />
            </div>
          </div>
        </div>

        <!-- PREMIO DE 5 CAFÉS -->
        <transition name="bounce">
          <div v-if="cafesComprados >= 5 && cafesComprados < 10" class="reward-banner reward-5">
            <template v-if="!premio5Reclamado">
              <h3>¡Felicidades!</h3>
              <p>Tienes tu bebida completamente <strong>GRATIS</strong></p>
              <img :src="premio5" alt="Bebida Gratis" class="reward-img" />
              <p class="claim-notice">🎁 Muestra esta pantalla en caja para reclamarlo</p>
            </template>
            <template v-else>
              <h3>¡Premio Reclamado! 🎉</h3>
              <p>Ya disfrutaste tu bebida de 5 cafés. ¡Sigue acumulando para tu premio de los 10 cafés!</p>
            </template>
          </div>
        </transition>

        <!-- PREMIO DE 10 CAFÉS -->
        <transition name="bounce">
          <div v-if="cafesComprados >= 10" class="reward-banner reward-10">
            <template v-if="!premio10Reclamado">
              <h3>¡Felicidades!</h3>
              <p>Tienes un café completamente <strong>GRATIS</strong></p>
              <img :src="premio10" alt="Cafés Fríos Gratis" class="reward-img-large" />
              <p class="claim-notice">🎁 Muestra esta pantalla en caja para reclamarlo</p>
            </template>
            <template v-else>
              <h3>¡Premio Mayor Reclamado! ⭐</h3>
              <p>¡Muchas gracias por tu lealtad! Sigue acumulando más cafés para iniciar un nuevo ciclo de sorpresas.</p>
            </template>
          </div>
        </transition>

      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { db } from '../firebase' 
import { doc, getDoc } from 'firebase/firestore'

// Importación de imágenes
import logoImage from '../assets/logo.jpg'
import vasoCafe from '../assets/vaso.png'
import premio5 from '../assets/cantarindo.png'
import premio10 from '../assets/cafesfrios.png'

// Estado
const telefono = ref('')
const cafesComprados = ref(null)
const premio5Reclamado = ref(false)
const premio10Reclamado = ref(false)
const toastMessage = ref('')
const cargando = ref(false)

const mostrarToast = (mensaje) => {
  toastMessage.value = mensaje
  setTimeout(() => {
    toastMessage.value = ''
  }, 4000)
}

const buscarUsuario = async () => {
  if (telefono.value.length < 10) {
    mostrarToast('Ingresa tu número a 10 dígitos.')
    cafesComprados.value = null
    return
  }

  cargando.value = true
  toastMessage.value = ''
  
  try {
    const clienteRef = doc(db, 'clientes', telefono.value)
    const clienteSnap = await getDoc(clienteRef)

    if (clienteSnap.exists()) {
      const data = clienteSnap.data()
      cafesComprados.value = data.cafes_comprados || 0
      premio5Reclamado.value = data.premio5_reclamado || false
      premio10Reclamado.value = data.premio10_reclamado || false
    } else {
      mostrarToast('Número no encontrado. ¡Regístrate en caja en tu próxima visita!')
      cafesComprados.value = null
    }
  } catch (err) {
    console.error("Error consultando Firebase:", err)
    mostrarToast('Error de conexión. Intenta de nuevo.')
    cafesComprados.value = null
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
.loyalty-container {
  max-width: 480px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #FDFBF7;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #3A2211;
  position: relative;
  overflow-x: hidden;
}

.floating-back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  color: #3A2211;
  text-decoration: none;
  font-weight: 700;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 20px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 50;
  transition: transform 0.2s ease, background-color 0.2s ease;
  border: 1px solid rgba(230, 216, 201, 0.5);
}

.floating-back-btn:active {
  transform: scale(0.92);
  background-color: rgba(255, 255, 255, 0.9);
}

.chevron {
  font-size: 12px;
}

.header {
  text-align: center;
  padding: 60px 20px 20px; 
}

.brand-logo {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 15px;
  object-fit: cover;
  background-color: white;
}

.brand-title {
  font-size: 24px;
  color: #1A3B2B;
  margin: 0 0 5px 0;
  font-weight: 700;
}

.brand-subtitle {
  font-size: 14px;
  color: #665243;
  margin: 0;
}

.brand-subtitle2 {
  font-size: 18px;
  color: #665243;
  margin: 0;
  font-weight: bold;
}

.search-section {
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.phone-input {
  width: 100%;
  padding: 15px;
  border: 2px solid #E6D8C9;
  border-radius: 12px;
  font-size: 16px;
  text-align: center;
  background-color: #FFFFFF;
  color: #3A2211;
  outline: none;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.phone-input:focus {
  border-color: #1A3B2B;
}

.phone-input:disabled {
  background-color: #f5f5f5;
  color: #999;
}

.btn-search {
  width: 100%;
  padding: 15px;
  background-color: #1A3B2B;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(26, 59, 43, 0.3);
  transition: transform 0.1s, background-color 0.3s, opacity 0.3s;
}

.btn-search:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-search:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.toast {
  position: fixed;
  top: 80px; 
  left: 50%;
  transform: translateX(-50%);
  background-color: #D9534F;
  color: white;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  z-index: 1000;
  width: max-content;
  max-width: 90%;
  text-align: center;
}

.results-section {
  padding: 0 20px 40px;
}

.status-card {
  background-color: white;
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(102, 82, 67, 0.08);
  border: 1px solid #F0EAE1;
}

.status-card h2 {
  font-size: 18px;
  margin: 0 0 10px 0;
}

.coffee-count {
  display: block;
  font-size: 28px;
  font-weight: bold;
  color: #1A3B2B;
  margin-bottom: 20px;
}

.cups-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.cup-item {
  width: calc(20% - 10px);
  min-width: 40px;
}

.cup-item img {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
}

.reward-banner {
  margin-top: 25px;
  border-radius: 20px;
  padding: 25px 20px;
  text-align: center;
  color: white;
  box-shadow: 0 10px 25px rgba(0,0,0,0.15);
}

.reward-banner h3 {
  font-size: 22px;
  margin: 0 0 5px 0;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.reward-banner p {
  font-size: 15px;
  margin: 0 0 15px 0;
}

.reward-5 {
  background: linear-gradient(135deg, #D4423E, #A02623);
}

.reward-10 {
  background: linear-gradient(135deg, #3A2211, #1A3B2B);
}

.reward-img {
  width: 160px;
  height: auto;
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.3));
  margin-bottom: 10px;
}

.reward-img-large {
  width: 100%;
  max-width: 280px;
  height: auto;
  filter: drop-shadow(0 8px 16px rgba(0,0,0,0.3));
  margin-bottom: 10px;
}

.claim-notice {
  font-size: 13px;
  background: rgba(0, 0, 0, 0.2);
  padding: 6px 12px;
  border-radius: 8px;
  display: inline-block;
  margin-top: 10px !important;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.slide-up-enter-active, .slide-up-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.slide-up-enter-from, .slide-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.bounce-enter-active {
  animation: bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
@keyframes bounce-in {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>