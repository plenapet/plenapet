import type { Metadata } from "next";
import Link from "next/link";
import { Badge, Button, Container } from "@plenapet/ui";

export const metadata: Metadata = {
  title: "Edad biológica y chequeo preventivo para tu mascota | PlenaPet Health",
  description:
    "PlenaPet Health calcula la edad biológica y el estado de salud por sistemas de tu perro o gato combinando una encuesta de bienestar validada y resultados de laboratorio (hemograma, química sanguínea, orina, coprológico). Prevención real, no solo reacción.",
  alternates: { canonical: "/health" },
  openGraph: {
    title: "PlenaPet Health — Chequeo preventivo y edad biológica de tu mascota",
    description:
      "Encuesta de bienestar + laboratorio, consolidados en un dashboard de salud por sistemas y edad biológica estimada.",
    type: "website",
  },
};

const FAQS = [
  {
    q: "¿Qué es la edad biológica de una mascota?",
    a: "Es un indicador de qué tan desgastados están el cuerpo y los órganos de tu mascota, más allá de los años que ha vivido (edad cronológica). Dos perros de la misma edad pueden tener una edad biológica muy distinta según su salud, alimentación y cuidado.",
  },
  {
    q: "¿Qué incluye el chequeo preventivo de PlenaPet Health?",
    a: "Una encuesta de bienestar sobre movilidad, digestión, piel y comportamiento, más — si decides hacerlo — un panel de laboratorio (hemograma, química sanguínea, uroanálisis y coprológico) que coordinamos con un laboratorio veterinario aliado.",
  },
  {
    q: "¿Reemplaza la visita al veterinario?",
    a: "No. PlenaPet Health es una herramienta de seguimiento y prevención que te ayuda a decidir cuándo vale la pena una consulta veterinaria, con datos concretos en la mano — no sustituye el diagnóstico ni el criterio de un veterinario.",
  },
  {
    q: "¿A partir de qué edad debería hacerle un chequeo preventivo a mi mascota?",
    a: "Se recomienda empezar el seguimiento desde adulto joven y hacerlo con más frecuencia a partir de los 7 años, cuando el riesgo de enfermedades crónicas (renales, articulares, metabólicas) aumenta.",
  },
];

export default function HealthLandingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-aqua-bienestar/15 to-transparent">
        <Container className="grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <Badge tone="aqua">Prevención, no solo reacción</Badge>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-azul-confianza sm:text-5xl">
              Descubre la edad biológica y el estado de salud real de tu
              mascota
            </h1>
            <p className="mt-4 max-w-xl text-base text-gris-pizarra">
              PlenaPet Health combina una encuesta de bienestar y resultados
              de laboratorio (hemograma, química sanguínea, orina,
              coprológico) en un solo dashboard: salud general, por sistema
              del cuerpo, y una edad biológica estimada — para que detectes
              problemas antes de que se conviertan en una urgencia.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/cuenta/registro?next=/health/mascotas">
                <Button size="lg">Registra a tu mascota gratis</Button>
              </Link>
              <Link href="#como-funciona">
                <Button size="lg" variant="secondary">
                  Ver cómo funciona
                </Button>
              </Link>
            </div>
          </div>
          <div className="rounded-card border border-azul-confianza/10 bg-white p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-wide text-gris-pizarra/70">
              Ejemplo de resultado
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="rounded-card bg-crema-calido p-4">
                <p className="text-xs text-gris-pizarra">Índice de vitalidad</p>
                <p className="text-3xl font-bold text-azul-confianza">86/100</p>
              </div>
              <div className="rounded-card bg-aqua-bienestar/15 p-4">
                <p className="text-xs text-azul-confianza/80">Edad biológica</p>
                <p className="text-3xl font-bold text-azul-confianza">4.2 años</p>
              </div>
            </div>
            <p className="mt-4 text-xs text-gris-pizarra">
              Renal · Hepático · Hematológico · Digestivo · Movilidad —
              evaluados por separado, no solo un número general.
            </p>
          </div>
        </Container>
      </section>

      {/* Cómo funciona */}
      <section id="como-funciona" className="py-16">
        <Container>
          <h2 className="text-2xl font-bold text-azul-confianza">
            Cómo funciona la prevención con PlenaPet Health
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "1",
                title: "Registra a tu mascota",
                text: "Crea su perfil: especie, raza, edad, peso.",
              },
              {
                n: "2",
                title: "Completa la encuesta de bienestar",
                text: "3 minutos sobre movilidad, digestión, piel y comportamiento.",
              },
              {
                n: "3",
                title: "Agrega un panel de laboratorio (opcional)",
                text: "Hemograma, química sanguínea, orina o coprológico, coordinado con nuestro laboratorio aliado.",
              },
              {
                n: "4",
                title: "Recibe su dashboard de salud",
                text: "Estado por sistema, edad biológica estimada y recomendaciones.",
              },
            ].map((step) => (
              <div
                key={step.n}
                className="rounded-card border border-azul-confianza/10 bg-white p-5 shadow-card"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-azul-confianza text-sm font-bold text-white">
                  {step.n}
                </span>
                <h3 className="mt-3 text-sm font-bold text-azul-confianza">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-gris-pizarra">{step.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Por qué la prevención importa */}
      <section className="bg-white py-16">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-azul-confianza">
              Por qué la prevención cambia la vida de tu mascota
            </h2>
            <p className="mt-4 text-sm text-gris-pizarra">
              Los perros y gatos esconden bien el dolor y las enfermedades
              tempranas — cuando los síntomas son evidentes, muchas veces ya
              avanzaron. La medicina veterinaria preventiva busca justamente
              eso: detectar cambios antes de que se conviertan en una
              urgencia, con controles periódicos y datos objetivos en vez de
              esperar a que "algo se vea mal".
            </p>
            <p className="mt-4 text-sm text-gris-pizarra">
              Nuestro índice de bienestar sigue la misma lógica de
              acumulación de déficits validada en un estudio con 401 perros
              (Banzato et al., 2019): un puntaje bajo se asoció con un riesgo
              de mortalidad a 6 meses hasta 18 veces mayor. Para el sistema
              renal usamos la estadificación IRIS, el estándar clínico
              veterinario reconocido mundialmente.
            </p>
          </div>
          <div className="rounded-card border border-azul-confianza/10 bg-crema-calido p-6">
            <h3 className="text-sm font-bold uppercase tracking-wide text-coral-cercania">
              Recomendado por edad
            </h3>
            <ul className="mt-3 space-y-2 text-sm text-gris-pizarra">
              <li>
                <strong className="text-azul-confianza">Cachorro/gatito:</strong>{" "}
                varios controles en el primer año.
              </li>
              <li>
                <strong className="text-azul-confianza">Adulto (1-7 años):</strong>{" "}
                chequeo al menos una vez al año.
              </li>
              <li>
                <strong className="text-azul-confianza">Senior (7+ años):</strong>{" "}
                cada 6 meses — mayor riesgo de enfermedad renal, articular y
                metabólica.
              </li>
            </ul>
          </div>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <Container className="max-w-3xl">
          <h2 className="text-2xl font-bold text-azul-confianza">
            Preguntas frecuentes
          </h2>
          <div className="mt-6 space-y-4">
            {FAQS.map((faq) => (
              <details
                key={faq.q}
                className="rounded-card border border-azul-confianza/10 bg-white p-5 shadow-card"
              >
                <summary className="cursor-pointer text-sm font-semibold text-azul-confianza">
                  {faq.q}
                </summary>
                <p className="mt-2 text-sm text-gris-pizarra">{faq.a}</p>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA final */}
      <section className="bg-azul-confianza py-16">
        <Container className="text-center">
          <h2 className="text-2xl font-bold text-white">
            Empieza a cuidar mejor a tu mascota hoy
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-white/80">
            Registrar a tu mascota y completar la encuesta de bienestar es
            gratis.
          </p>
          <Link href="/cuenta/registro?next=/health/mascotas" className="mt-6 inline-block">
            <Button size="lg" variant="secondary">
              Registra a tu mascota gratis
            </Button>
          </Link>
        </Container>
      </section>
    </>
  );
}
