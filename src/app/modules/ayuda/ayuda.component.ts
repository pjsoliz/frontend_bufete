import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ayuda',
  templateUrl: './ayuda.component.html',
  styleUrls: ['./ayuda.component.css']
})
export class AyudaComponent implements OnInit {

  faqs = [
    {
      pregunta: '¿Cómo crear una nueva cita?',
      respuesta: 'Ve a la sección "Citas" en el menú lateral y haz clic en el botón "Nueva Cita". Completa el formulario con la información del cliente, selecciona el abogado, área de derecho y confirma la cita.'
    },
    {
      pregunta: '¿Cómo gestionar usuarios del sistema?',
      respuesta: 'Solo los administradores pueden gestionar usuarios. Ve a "Usuarios" en el menú lateral donde podrás crear, editar, activar o desactivar usuarios del sistema.'
    },
    {
      pregunta: '¿Cómo agregar un nuevo cliente?',
      respuesta: 'Accede a la sección "Clientes" y haz clic en "Nuevo Cliente". Completa los datos del cliente incluyendo nombre, teléfono y email. El cliente quedará registrado en el sistema.'
    },
    {
      pregunta: '¿Cómo generar reportes?',
      respuesta: 'Accede a la sección "Reportes" donde podrás generar diferentes tipos de informes del sistema, incluyendo estadísticas de citas, clientes y desempeño general.'
    },
    {
      pregunta: '¿Cómo cambiar mi contraseña?',
      respuesta: 'Ve a Configuración > Seguridad y selecciona "Cambiar Contraseña". Deberás ingresar tu contraseña actual y la nueva contraseña dos veces para confirmar.'
    },
    {
      pregunta: '¿Qué hacer si olvido mi contraseña?',
      respuesta: 'En la pantalla de login, haz clic en "¿Olvidaste tu contraseña?". Ingresa tu email y recibirás instrucciones para restablecerla.'
    }
  ];

  constructor() {}

  ngOnInit(): void {}

  contactarSoporte(): void {
    window.location.href = 'mailto:soporte@genesis.com';
  }
}