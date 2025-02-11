import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { Database, ref, get, child } from '@angular/fire/database';

@Component({
  selector: 'app-register-client',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-client.component.html',
  styleUrl: './register-client.component.css'
})

export class RegisterClientComponent {
  private db = inject(Database);
  entrenadores: { uid: string; nombre: string; apellido1: string }[] = [];

  ngForm = new FormGroup({
    entrenador: new FormControl(''),
    nombre: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    sexo: new FormControl('M'),
    altura: new FormControl('', [Validators.required, Validators.min(100)]),
    peso: new FormControl('', [Validators.required, Validators.min(40)]),
    fechaNacimiento: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefono: new FormControl('', [Validators.pattern('^[0-9]{9}$')]),
    trato: new FormControl('N'),
    objetivoGeneral: new FormControl('hipertrofia', [Validators.required]),
    entrenamientosPorSemana: new FormControl('1', [Validators.required]),
    workoutPlan: new FormControl(''),
    energiaObjetivo: new FormControl('', [Validators.min(1000)]),
    proteinas: new FormControl('25', [Validators.min(10), Validators.max(35)]),
    grasas: new FormControl('30', [Validators.min(20), Validators.max(40)]),
    carbohidratos: new FormControl('45', [Validators.min(40), Validators.max(60)]),
    restriccionesAlimentarias: new FormControl(''),
    gcActual: new FormControl('', [Validators.min(5), Validators.max(40)]),
    gcObjetivo: new FormControl('', [Validators.min(5), Validators.max(40)]),
    pesoObjetivo: new FormControl('', [Validators.min(40)])
  });

  constructor() {
    this.ngForm.get('proteinas')?.valueChanges.subscribe(() => this.validarTotalMacronutrientes());
    this.ngForm.get('grasas')?.valueChanges.subscribe(() => this.validarTotalMacronutrientes());
  }

  ngOnInit() {
    this.obtenerEntrenadores();
  }

  async obtenerEntrenadores() {
    const dbRef = ref(this.db, 'Usuarios/Entrenadores');
    
    try {
      const snapshot = await get(dbRef);
      if (snapshot.exists()) {
        console.log('Datos obtenidos de Firebase:', snapshot.val()); // Verifica los datos aquí
        this.entrenadores = Object.entries(snapshot.val()).map(([uid, data]: [string, any]) => ({
          uid,
          nombre: data.Nombre?.Nombre || '',
          apellido1: data.Nombre?.Apellido1 || ''
        }));
      } else {
        console.log('No hay entrenadores registrados.');
      }
    } catch (error) {
      console.error('Error obteniendo entrenadores:', error);
    }
  }
  

  recalcularCarbohidratos() {
    const proteinas = parseFloat(this.proteinas?.value || '0');
    const grasas = parseFloat(this.grasas?.value || '0');
    const totalActual = proteinas + grasas;
    
    if (totalActual <= 100) {
      this.carbohidratos?.setValue((100 - totalActual).toString());
    }
    
    this.validarTotalMacronutrientes();
  }

  validarTotalMacronutrientes() {
    const proteinas = parseFloat(this.proteinas?.value || '0');
    const grasas = parseFloat(this.grasas?.value || '0');
    const carbohidratos = parseFloat(this.carbohidratos?.value || '0');
    const total = proteinas + grasas + carbohidratos;

    if (total !== 100) {
      this.carbohidratos?.setErrors({ total: true });
    } else {
      this.carbohidratos?.setErrors(null);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.ngForm.valid) {
      console.log('Datos del cliente:', this.ngForm.value);
      // Aquí puedes enviar los datos al backend o procesarlos
    }
  }

  get formControls() {
    return this.ngForm.controls;
  }

  get entrenador() { return this.formControls.entrenador; }
  get nombre() { return this.formControls.nombre; }
  get apellidos() { return this.formControls.apellidos; }
  get sexo() { return this.formControls.sexo; }
  get altura() { return this.formControls.altura; }
  get peso() { return this.formControls.peso; }
  get fechaNacimiento() { return this.formControls.fechaNacimiento; }
  get email() { return this.formControls.email; }
  get telefono() { return this.formControls.telefono; }
  get trato() { return this.formControls.trato; }
  get objetivoGeneral() { return this.formControls.objetivoGeneral; }
  get entrenamientosPorSemana() { return this.formControls.entrenamientosPorSemana; }
  get workoutPlan() { return this.formControls.workoutPlan; }
  get energiaObjetivo() { return this.formControls.energiaObjetivo; }
  get proteinas() { return this.formControls.proteinas; }
  get grasas() { return this.formControls.grasas; }
  get carbohidratos() { return this.formControls.carbohidratos; }
  get restriccionesAlimentarias() { return this.formControls.restriccionesAlimentarias; }
  get gcActual() { return this.formControls.gcActual; }
  get gcObjetivo() { return this.formControls.gcObjetivo; }
  get pesoObjetivo() { return this.formControls.pesoObjetivo; }
}
