import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators, FormControl } from '@angular/forms';
import { Database, ref, get, set } from '@angular/fire/database';
import { Router } from '@angular/router';
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

  constructor(private router: Router) {
    this.ngForm.get('proteinas')?.valueChanges.subscribe(() => this.validarTotalMacronutrientes());
    this.ngForm.get('grasas')?.valueChanges.subscribe(() => this.validarTotalMacronutrientes());
  }

  ngOnInit() {
    this.obtenerEntrenadores();
  }

  /* Obtener listado de entrenadores */
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

  /* Cálculos de macros */
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

  /* Crear cliente */
  crearCliente(formData: any): any {
    const timestampActual = Math.floor(Date.now() / 1000);
    const fechaNacimiento = formData.fechaNacimiento;
    const timestampNacimiento = fechaNacimiento ?
        Math.floor(new Date(fechaNacimiento).getTime() / 1000) : null;
    const clienteUID = "ATH" + (timestampActual * 10);
    
    return {
        [clienteUID]: {
            "Activo": true,
            "Entrenadores": formData.entrenador ? {
              [formData.entrenador]: {
                "Desde": timestampActual
              }
            } : [],
            "Fecha nacimiento": timestampNacimiento,
            "Mediciones": {
                "Actual": {
                    "Altura": formData.altura || 0,
                    "Fecha": timestampActual,
                    "Grasa": formData.gcActual || null,
                    "Peso": formData.peso || 0
                }
            },
            "Nombre": {
                "Apellido1": formData.apellidos?.split(' ')?.[0] ?? '',
                "Apellido2": formData.apellidos?.split(' ')?.[1] ?? '',
                "Nombre": formData.nombre || ''
            },
            "Objetivos": {
                "Deportivos": {
                    "Entrenamientos por semana": formData.entrenamientosPorSemana || 0
                },
                "Nutricionales": {
                    "Carbohidratos": parseFloat(formData.carbohidratos) || 0,
                    "Grasas": parseFloat(formData.grasas) || 0,
                    "Kcal": parseInt(formData.energiaObjetivo) || null,
                    "Proteínas": parseFloat(formData.proteinas) || 0,
                    "Restricciones": formData.restriccionesAlimentarias ? 
                        JSON.parse(formData.restriccionesAlimentarias) : {}
                },
                "Físicos": {
                    "Grasa": parseFloat(formData.gcObjetivo) || null,
                    "Peso": parseInt(formData.pesoObjetivo) || null
                }
            },
            "Registro": timestampActual,
            "Sexo": formData.sexo || '',
            "Workouts": {
                "Pendientes": []
            }
        }
    };
  }
  /* -Para cuando esté el authenticator- */
  crearClienteUID(formData: any, clienteUID: string): any {
    const timestampActual = Math.floor(Date.now() / 1000); // Timestamp actual en segundos

    return {
      [clienteUID]: {
        "Activo": true,
        "Entrenadores": formData.entrenador ? {
          [formData.entrenador]: {
            "Desde": timestampActual
          }
        } : [],
        "Fecha nacimiento": new Date(formData.fechaNacimiento).getTime() / 1000, // Convertir a timestamp
        "Mediciones": {
          "Actual": {
            "Altura": formData.altura || 0,
            "Fecha": timestampActual,
            "Grasa": formData.gcActual || null,
            "Peso": formData.peso
          }
        },
        "Nivel de actividad": formData.entrenamientosPorSemana,
        "Nombre": {
          "Apellido1": formData.apellidos ? formData.apellidos.split(' ')[0] || '' : '',
          "Apellido2": formData.apellidos ? formData.apellidos.split(' ')[1] || '' : '',
          "Nombre": formData.nombre || ''
        },
        "Objetivos": {
          "Deportivos": {
            "Entrenamientos por semana": formData.entrenamientosPorSemana
          },
          "Físicos": {
            "Grasa": formData.gcObjetivo || null,
            "Peso": formData.pesoObjetivo || null
          },
          "Nutricionales": {
            "Carbohidratos": formData.carbohidratos,
            "Grasas": formData.grasas,
            "Kcal": formData.energiaObjetivo || null,
            "Proteínas": formData.proteinas,
            "Restricciones": formData.restriccionesAlimentarias ? JSON.parse(formData.restriccionesAlimentarias) : {}
          },
          "Plan": formData.objetivoGeneral
        },
        "Registro": timestampActual,
        "Sexo": formData.sexo,
        "Workouts": {
          "Pendientes": [] // Inicialmente vacío
        }
      }
    }
  }

  /* Registrar cliente */
  registrarCliente(cliente: any) {
    const clienteUID = Object.keys(cliente)[0];
    const clienteRef = ref(this.db, `Usuarios/Clientes/${clienteUID}`);

    set(clienteRef, cliente[clienteUID])
      .then(() => {
        console.log("Cliente agregado correctamente.");
      })
      .catch((error) => {
        console.error("Error al agregar cliente:", error);
      });
  }

  /* Enviar cliente a Firebase */
  async onSubmit(): Promise<void> {
    if (this.ngForm.valid) {
        try {
            // Obtener los valores del formulario directamente
            const formData = this.ngForm.value;
            
            // Crear el objeto cliente con los datos validados
            const cliente = this.crearCliente(formData);
            
            // Registrar el cliente y esperar la respuesta
            await this.registrarCliente(cliente);
            
            // Limpiar el formulario después de un registro exitoso
            this.ngForm.reset();

            //this.router.navigate(['/home', uid]);
            
        } catch (error) {
            console.error('Error durante el proceso:', error);
        }
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
