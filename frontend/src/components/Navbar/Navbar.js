import ButtonLayout from '../button_layout/button_layout'
import './Navbar.css'

export default function Navbar() {
  return (
    <div class="glassmorphism main-navbar">
      
      <ButtonLayout variant="default" style={{color: 'white'}}>
        Gene Celltype
      </ButtonLayout>
      <header class="navbar-heading">CBM2</header>
      <header class="navbar-sitename">fisheyes</header>
    </div>
  )
}
