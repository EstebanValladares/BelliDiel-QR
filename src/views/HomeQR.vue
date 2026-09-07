<script setup>
import logoImage from '../assets/logo.jpg'

const socialLinks = [
  { name: 'TikTok', url: 'https://www.tiktok.com/@bellidiel.coffee?_r=1&_t=ZS-99UfWAwe8Di', icon: '🎵', class: 'tiktok' },
  { name: 'Facebook', url: 'https://www.facebook.com/share/1F1upTENQD/', icon: '👥', class: 'facebook' },
  { name: 'Instagram', url: 'https://www.instagram.com/bellidiel_coffe?stkn=MWN0dGl5aTk5ODFlbw==', icon: '📸', class: 'instagram' },
  { name: 'WhatsApp', url: 'https://wa.me/528333073501', icon: '💬', class: 'whatsapp' }
]
</script>

<template>
  <div class="mobile-container">
    <header class="profile-header">
      <div class="logo-wrapper">
        <img :src="logoImage" alt="BelliDiel Coffee Logo" class="logo" />
      </div>
      <h1>BelliDiel Coffee</h1>
      <p>¡Escanea, conéctate y disfruta con nosotros! 🐾☕</p>
    </header>

    <main class="links-container">
      <a 
        v-for="link in socialLinks" 
        :key="link.name" 
        :href="link.url" 
        target="_blank" 
        rel="noopener noreferrer"
        :class="['social-button', link.class]"
      >
        <span class="icon">{{ link.icon }}</span>
        <span class="text">{{ link.name }}</span>
      </a>

      <router-link to="/lealtad" class="loyalty-button">
        <span class="icon">☕</span>
        <span class="text">Mis Cafes</span>
      </router-link>

      <router-link to="/admin-bellidiel" class="admin-button">
        <span class="icon">🔒</span>
        <span class="text">BelliDiel</span>
      </router-link>
    </main>

    <footer class="footer">
      <p>&copy; 2026 BelliDiel Coffee. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<style scoped>
.mobile-container {
  max-width: 480px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  background-color: #fcf9f5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  color: #3e2723;
}

.profile-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-wrapper {
  width: 130px;
  height: 130px;
  margin: 0 auto 1rem auto;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 6px 15px rgba(111, 78, 55, 0.2);
  border: 3px solid #d2b48c;
}

.logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-header h1 {
  font-size: 1.8rem;
  margin: 0.5rem 0;
  color: #4e342e;
  font-weight: 700;
}

.profile-header p {
  font-size: 0.95rem;
  color: #6d4c41;
  margin: 0;
}

.links-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}

.social-button {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 1rem 1.5rem;
  background-color: #ffffff;
  border: 2px solid #e0d0c0;
  border-radius: 50px;
  text-decoration: none;
  color: #3e2723;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04);
}

.social-button .icon {
  position: absolute;
  left: 20px;
  font-size: 1.3rem;
}

.social-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(111, 78, 55, 0.15);
  background-color: #f4ece1;
  border-color: #8d6e63;
}

.loyalty-button {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 1rem 1.5rem;
  background-color: #4e342e;
  border: none;
  border-radius: 50px;
  text-decoration: none;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(78, 52, 46, 0.3);
  margin-top: 0.5rem;
}

.loyalty-button .icon {
  position: absolute;
  left: 20px;
  font-size: 1.3rem;
}

.loyalty-button:hover {
  transform: translateY(-3px);
  background-color: #3e2723;
}


.admin-button {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 1rem 1.5rem;
  background-color: #2b170e;
  border: 2px dashed #d2b48c;
  border-radius: 50px;
  text-decoration: none;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.admin-button .icon {
  position: absolute;
  left: 20px;
  font-size: 1.2rem;
}

.admin-button:hover {
  transform: translateY(-3px);
  background-color: #1a0e08;
  border-color: #ffffff;
}

.footer {
  text-align: center;
  margin-top: 2rem;
  font-size: 0.8rem;
  color: #8d6e63;
}
</style>