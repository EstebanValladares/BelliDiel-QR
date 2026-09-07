<script setup>
import { ref } from 'vue'
import { db } from '../firebase'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import logoImage from '../assets/logo.jpg'

const auth = getAuth()

const estaAutenticado = ref(false)
const emailInput = ref('')
const passwordInput = ref('')
const errorLogin = ref('')
const cargandoLogin = ref(false)

const verificarPassword = async () => {
  if (!emailInput.value || !passwordInput.value) {
    errorLogin.value = 'Por favor ingresa correo y contraseña.'
    return
  }

  cargandoLogin.value = true
  errorLogin.value = ''

  try {
    await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    estaAutenticado.value = true
  } catch (err) {
    console.error("Error de autenticación:", err)
    errorLogin.value = 'Correo o contraseña incorrectos.'
  } finally {
    cargandoLogin.value = false
  }
}

const telefonoCliente = ref('')
const clienteEncontrado = ref(null)
const cafesActuales = ref(0)
const cantidadACambiar = ref(null)
const mensajeExito = ref('')
const errorBusqueda = ref('')
const cargando = ref(false)

const buscarCliente = async () => {
  if (telefonoCliente.value.length < 10) {
    errorBusqueda.value = 'Ingresa un número a 10 dígitos.'
    clienteEncontrado.value = null
    return
  }

  cargando.value = true
  errorBusqueda.value = ''
  mensajeExito.value = ''

  try {
    const clienteRef = doc(db, 'clientes', telefonoCliente.value)
    const clienteSnap = await getDoc(clienteRef)

    if (clienteSnap.exists()) {
      cafesActuales.value = clienteSnap.data().cafes_comprados
      clienteEncontrado.value = true
    } else {
      cafesActuales.value = 0
      clienteEncontrado.value = false
    }
  } catch (err) {
    console.error("Error buscando cliente:", err)
    errorBusqueda.value = 'Error al conectar con la base de datos.'
  } finally {
    cargando.value = false
  }
}

const actualizarCafes = async () => {
  const cantidad = parseInt(cantidadACambiar.value)
  if (isNaN(cantidad)) {
    errorBusqueda.value = 'Ingresa un número válido de cafés.'
    return
  }

  cargando.value = true
  errorBusqueda.value = ''
  mensajeExito.value = ''

  try {
    const clienteRef = doc(db, 'clientes', telefonoCliente.value)
    let nuevoTotal = cafesActuales.value + cantidad

    if (nuevoTotal < 0) nuevoTotal = 0
    
    const clienteSnap = await getDoc(clienteRef)

    if (clienteSnap.exists()) {
      await updateDoc(clienteRef, { cafes_comprados: nuevoTotal })
    } else {
      await setDoc(clienteRef, { cafes_comprados: nuevoTotal })
    }

    cafesActuales.value = nuevoTotal
    clienteEncontrado.value = true
    cantidadACambiar.value = ''
    mensajeExito.value = `¡Actualizado con éxito! Total actual: ${nuevoTotal} ☕`
  } catch (err) {
    console.error("Error al actualizar sellos:", err)
    errorBusqueda.value = 'No se pudo guardar el cambio.'
  } finally {
    cargando.value = false
  }
}
</script>

<template>
  <div class="mobile-container">
    <div class="coffee-beans-pattern"></div>

    <nav class="top-bar">
      <router-link to="/" class="back-button">
        <span class="chevron">❮</span> Volver al menú
      </router-link>
    </nav>

    <div v-if="!estaAutenticado" class="login-card fade-in">
      <div class="logo-wrapper pulse-glow">
        <img :src="logoImage" alt="BelliDiel Logo" class="logo-img" />
      </div>

      <div class="header-text-box">
        <span class="lock-badge">🔒 Acceso Propietarios</span>
        <h2>BelliDiel Coffee</h2>
        <p>Inicia sesión con tu cuenta de administrador</p>
      </div>

      <div class="input-group">
        <label for="admin-email">Correo de Administrador</label>
        <div class="input-inner-wrapper">
          <span class="input-icon">📧</span>
          <input 
            id="admin-email"
            v-model="emailInput" 
            type="email" 
            placeholder="ejemplo@bellidiel.com"
            autocomplete="email"
            class="admin-input"
          />
        </div>

        <label for="admin-pass">Contraseña</label>
        <div class="input-inner-wrapper">
          <span class="input-icon">🔑</span>
          <input 
            id="admin-pass"
            v-model="passwordInput" 
            type="password" 
            placeholder="********"
            autocomplete="current-password"
            @keyup.enter="verificarPassword"
            class="admin-input"
          />
        </div>

        <button @click="verificarPassword" class="admin-btn" :disabled="cargandoLogin">
          {{ cargandoLogin ? 'Verificando...' : 'Ingresar al Sistema' }}
        </button>
      </div>
      
      <transition name="shake">
        <p v-if="errorLogin" class="error-msg">⚠️ {{ errorLogin }}</p>
      </transition>
    </div>

    <div v-else class="panel-card fade-in">
      <div class="panel-header-badge">
        <span class="badge-icon">☕</span> Panel de Control
      </div>
      <h2>Gestión de Compras</h2>
      <p class="panel-subtitle">Agrega puntos al programa de clientes</p>

      <div class="input-group">
        <label for="phone-search">WhatsApp del Cliente (10 dígitos)</label>
        <div class="search-row">
          <input 
            id="phone-search"
            v-model="telefonoCliente" 
            type="tel" 
            maxlength="10" 
            placeholder="Ej. 8331234567"
            @keyup.enter="buscarCliente"
            class="admin-input phone-search-input"
          />
          <button @click="buscarCliente" class="admin-btn search-btn" :disabled="cargando">
            {{ cargando ? '...' : 'Buscar' }}
          </button>
        </div>
      </div>

      <p v-if="errorBusqueda" class="error-msg">⚠️ {{ errorBusqueda }}</p>
      <p v-if="mensajeExito" class="success-msg">✨ {{ mensajeExito }}</p>

      <div v-if="clienteEncontrado !== null" class="client-result-box slide-up">
        <div class="status-info">
          <div class="client-phone-tag">📱 WhatsApp: {{ telefonoCliente }}</div>
          <div class="cafes-display-card">
            <span class="cafes-label">Cafés acumulados</span>
            <span class="cafes-number">{{ cafesActuales }} ☕</span>
          </div>
          <p v-if="!clienteEncontrado" class="new-notice">
            💡 Este número es nuevo. Al agregar cafés se registrará automáticamente.
          </p>
        </div>

        <div class="input-group" style="margin-top: 1rem;">
          <label for="cantidad-cafes">Cantidad de Cafés a Sumar</label>
          <div class="search-row">
            <input 
              id="cantidad-cafes"
              v-model="cantidadACambiar" 
              type="number" 
              placeholder="Ej. 3 o -1"
              @keyup.enter="actualizarCafes"
              class="admin-input phone-search-input"
            />
            <button @click="actualizarCafes" class="admin-btn update-btn" :disabled="cargando">
              {{ cargando ? 'Guardando...' : 'Enviar ☕' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&display=swap');

.mobile-container {
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 0.8rem 0.8rem 2rem 0.8rem;
  background: linear-gradient(135deg, #fdf6ec 0%, #f4e8d3 100%);
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
  opacity: 0.2;
  pointer-events: none;
  z-index: 0;
}

.top-bar {
  display: flex;
  align-items: center;
  height: 40px;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 2;
  width: 100%;
}

.back-button {
  display: flex;
  align-items: center;
  color: #4a2c20;
  text-decoration: none;
  font-weight: 700;
  font-size: 0.85rem;
  background: rgba(255, 255, 255, 0.7);
  padding: 6px 12px;
  border-radius: 12px;
  backdrop-filter: blur(4px);
  box-shadow: 0 2px 6px rgba(62, 39, 35, 0.05);
  transition: all 0.2s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.9);
}

.chevron {
  margin-right: 4px;
}

.login-card, .panel-card {
  position: relative;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(10px);
  border: 2px solid #ecdcd0;
  border-radius: 20px;
  padding: 1.5rem 1rem;
  text-align: center;
  box-shadow: 0 12px 30px rgba(62, 39, 35, 0.07);
  margin-top: 0.4rem;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
}

.logo-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 0.8rem auto;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #f7cac9;
  background: white;
  box-shadow: 0 6px 15px rgba(62, 39, 35, 0.1);
  box-sizing: border-box;
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.header-text-box {
  margin-bottom: 1.2rem;
  width: 100%;
  box-sizing: border-box;
}

.lock-badge {
  display: inline-block;
  background-color: #fce8e6;
  color: #b71c1c;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  margin-bottom: 6px;
  letter-spacing: 0.4px;
  max-width: 100%;
  box-sizing: border-box;
}

.login-card h2, .panel-card h2 {
  font-size: 1.35rem;
  margin: 0 0 3px 0;
  color: #3e2723;
  font-weight: 800;
  word-break: break-word;
}

.login-card p, .panel-subtitle {
  font-size: 0.8rem;
  color: #795548;
  margin: 0;
  word-break: break-word;
}

.panel-header-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-bottom: 8px;
  max-width: 100%;
  box-sizing: border-box;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
  text-align: left;
  margin-bottom: 0.9rem;
  width: 100%;
  box-sizing: border-box;
}

.input-group label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #5d4037;
  letter-spacing: 0.3px;
  margin-left: 2px;
}

.input-inner-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 8px;
}

.input-icon {
  position: absolute;
  left: 12px;
  font-size: 0.95rem;
  pointer-events: none;
  z-index: 3;
}

.search-row {
  display: flex;
  gap: 6px;
  width: 100%;
  box-sizing: border-box;
}

.admin-input {
  width: 100%;
  padding: 0.8rem 0.8rem 0.8rem 2.4rem;
  border: 2px solid #e0d0c0;
  border-radius: 12px;
  font-size: 0.95rem;
  background-color: #fffaf5;
  color: #3e2723;
  outline: none;
  font-family: 'Montserrat', sans-serif;
  font-weight: 600;
  transition: all 0.25s ease;
  box-sizing: border-box;
}

.phone-search-input {
  padding-left: 0.8rem !important;
  text-align: center;
}

.admin-input:focus {
  border-color: #8d6e63;
  background-color: #ffffff;
  box-shadow: 0 0 0 3px rgba(141, 110, 99, 0.12);
}

.admin-btn {
  width: 100%;
  padding: 0.8rem;
  background: linear-gradient(135deg, #4a2c20 0%, #3e1f13 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 800;
  font-size: 0.9rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(62, 31, 19, 0.15);
  transition: transform 0.15s ease;
  box-sizing: border-box;
  flex-shrink: 0;
}

.admin-btn:active {
  transform: scale(0.97);
}

.search-btn {
  width: auto;
  padding: 0 1rem;
}

.update-btn {
  width: auto;
  padding: 0 1rem;
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
}

.error-msg {
  color: #c62828;
  font-size: 0.8rem;
  margin-top: 6px;
  font-weight: 600;
  background-color: #ffebee;
  padding: 7px 10px;
  border-radius: 8px;
  border: 1px solid #ffcdd2;
  text-align: center;
  box-sizing: border-box;
  word-break: break-word;
}

.success-msg {
  color: #2e7d32;
  font-size: 0.85rem;
  margin-top: 6px;
  font-weight: 700;
  background-color: #e8f5e9;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #c8e6c9;
  text-align: center;
  box-sizing: border-box;
  word-break: break-word;
}

.client-result-box {
  background-color: #fcf8f2;
  border: 2px solid #ecdcd0;
  border-radius: 14px;
  padding: 1rem;
  margin-top: 1rem;
  text-align: left;
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
}

.client-phone-tag {
  display: inline-block;
  background: #ecdcd0;
  color: #3e2723;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 700;
  margin-bottom: 8px;
  max-width: 100%;
  box-sizing: border-box;
  word-break: break-all;
}

.cafes-display-card {
  background: #ffffff;
  border: 1px solid #e0d0c0;
  border-radius: 10px;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  box-sizing: border-box;
  width: 100%;
}

.cafes-label {
  font-size: 0.8rem;
  color: #795548;
  font-weight: 600;
}

.cafes-number {
  font-size: 1.2rem;
  color: #2e7d32;
  font-weight: 800;
}

.new-notice {
  font-size: 0.75rem;
  color: #e65100;
  margin: 4px 0 0 0;
  line-height: 1.25;
  background-color: #fff3e0;
  padding: 7px;
  border-radius: 6px;
  box-sizing: border-box;
}

.fade-in {
  animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.slide-up {
  animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulseGlow {
  0% { box-shadow: 0 0 0 0 rgba(247, 202, 201, 0.35); }
  70% { box-shadow: 0 0 0 8px rgba(247, 202, 201, 0); }
  100% { box-shadow: 0 0 0 0 rgba(247, 202, 201, 0); }
}

.pulse-glow {
  animation: pulseGlow 2.5s infinite;
}
</style>