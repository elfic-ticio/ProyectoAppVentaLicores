export default function AvisoPrivacidadPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-28 text-slate-300">
      <h1 className="text-3xl font-black text-white mb-2">Aviso de Privacidad</h1>
      <p className="text-slate-500 text-sm mb-10">Última actualización: mayo 2026</p>

      <section className="space-y-8 text-sm leading-relaxed">
        <div>
          <h2 className="text-white font-bold text-base mb-2">Responsable del tratamiento</h2>
          <p>
            Merma Marketplace S.A.S. de C.V. (en adelante "Merma"), con domicilio en Ciudad de México,
            es responsable del tratamiento de sus datos personales conforme a la{" "}
            <strong className="text-white">Ley Federal de Protección de Datos Personales en Posesión de los
            Particulares (LFPDPPP)</strong> y su Reglamento.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-base mb-2">Datos personales recabados</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Nombre completo</li>
            <li>Correo electrónico</li>
            <li>Número de teléfono</li>
            <li>Dirección de entrega (al realizar una compra)</li>
            <li>Datos de pago procesados por terceros certificados PCI DSS</li>
          </ul>
        </div>

        <div>
          <h2 className="text-white font-bold text-base mb-2">Finalidades del tratamiento</h2>
          <p className="font-semibold text-slate-200 mb-1">Finalidades primarias (necesarias):</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 mb-3">
            <li>Crear y gestionar su cuenta de usuario</li>
            <li>Procesar y entregar pedidos</li>
            <li>Emitir comprobantes fiscales (CFDI)</li>
            <li>Atender consultas y aclaraciones</li>
            <li>Prevenir fraudes y cumplir obligaciones legales</li>
          </ul>
          <p className="font-semibold text-slate-200 mb-1">Finalidades secundarias (opcionales):</p>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Envío de comunicaciones de marketing y promociones</li>
            <li>Encuestas de satisfacción</li>
          </ul>
          <p className="mt-2 text-slate-500">
            Puede oponerse a las finalidades secundarias enviando un correo a{" "}
            <a href="mailto:privacidad@merma.mx" className="text-purple-400 underline">privacidad@merma.mx</a>.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-base mb-2">Transferencia de datos</h2>
          <p>
            Sus datos podrán ser compartidos con proveedores de servicios (procesadores de pago,
            mensajería, emisión de CFDI) únicamente para cumplir las finalidades descritas. Dichos
            terceros están contractualmente obligados a mantener la confidencialidad de sus datos.
            No se venden ni ceden datos personales a terceros con fines comerciales.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-base mb-2">Derechos ARCO</h2>
          <p>
            Usted tiene derecho de <strong className="text-white">Acceso, Rectificación, Cancelación y
            Oposición</strong> al tratamiento de sus datos. Para ejercerlos, envíe su solicitud a{" "}
            <a href="mailto:privacidad@merma.mx" className="text-purple-400 underline">privacidad@merma.mx</a>{" "}
            indicando su nombre, correo registrado y la acción solicitada. Responderemos en un plazo no
            mayor a 20 días hábiles.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-base mb-2">Retención de datos</h2>
          <p>
            Conservamos sus datos mientras su cuenta esté activa o sea necesario para cumplir
            obligaciones legales (mínimo 5 años para datos fiscales conforme al SAT).
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-base mb-2">Cambios al aviso</h2>
          <p>
            Merma se reserva el derecho de modificar este aviso. Cualquier cambio será notificado
            por correo electrónico o mediante aviso visible en la plataforma.
          </p>
        </div>
      </section>
    </main>
  );
}
