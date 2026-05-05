export default function TerminosPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-28 text-slate-300">
      <h1 className="text-3xl font-black text-white mb-2">Términos y Condiciones</h1>
      <p className="text-slate-500 text-sm mb-10">Última actualización: mayo 2026</p>

      <section className="space-y-8 text-sm leading-relaxed">
        <div>
          <h2 className="text-white font-bold text-base mb-2">1. Aceptación</h2>
          <p>
            Al registrarse y utilizar la plataforma Merma, usted acepta quedar vinculado por los
            presentes Términos y Condiciones. Si no está de acuerdo, por favor no utilice el servicio.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-base mb-2">2. Descripción del servicio</h2>
          <p>
            Merma es un marketplace B2C que conecta a compradores finales con retailers mexicanos que
            comercializan productos nuevos con defectos menores, obsolescencia o empaque dañado
            ("merma retail"), a precios con descuento.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-base mb-2">3. Cuenta de usuario</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Debe ser mayor de 18 años para registrarse y realizar compras.</li>
            <li>Es responsable de mantener la confidencialidad de su contraseña.</li>
            <li>Debe proporcionar información veraz y actualizada.</li>
            <li>Una cuenta por persona física o moral.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-white font-bold text-base mb-2">4. Compras y pagos</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Los precios se muestran en pesos mexicanos (MXN) e incluyen IVA.</li>
            <li>Los pagos se procesan de forma segura a través de Stripe o Conekta.</li>
            <li>Merma emite CFDI (factura electrónica) al momento de la compra.</li>
            <li>Una transacción confirmada constituye un contrato de compraventa.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-white font-bold text-base mb-2">5. Política de devoluciones</h2>
          <p>
            Dado que los productos son merma retail, se describen explícitamente sus condiciones.
            Se aceptan devoluciones únicamente si:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 mt-2">
            <li>El producto recibido no coincide con la descripción publicada.</li>
            <li>El producto llegó dañado durante el envío (con evidencia fotográfica).</li>
            <li>La solicitud se realiza dentro de los 3 días naturales siguientes a la recepción.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-white font-bold text-base mb-2">6. Conducta prohibida</h2>
          <ul className="list-disc list-inside space-y-1 text-slate-400">
            <li>Usar la plataforma para actividades ilegales o fraudulentas.</li>
            <li>Intentar acceder a cuentas de otros usuarios.</li>
            <li>Publicar reseñas falsas o difamatorias.</li>
            <li>Usar bots o scripts para manipular el sistema.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-white font-bold text-base mb-2">7. Limitación de responsabilidad</h2>
          <p>
            Merma actúa como intermediario. La responsabilidad del vendedor se limita al valor del
            producto adquirido. Merma no será responsable por daños indirectos, incidentales o
            consecuentes derivados del uso de la plataforma.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-base mb-2">8. Ley aplicable y jurisdicción</h2>
          <p>
            Estos términos se rigen por las leyes de los Estados Unidos Mexicanos. Para cualquier
            controversia, las partes se someten a la jurisdicción de los tribunales competentes de
            la Ciudad de México, renunciando a cualquier otro fuero que pudiera corresponderles.
          </p>
        </div>

        <div>
          <h2 className="text-white font-bold text-base mb-2">9. Contacto</h2>
          <p>
            Para cualquier duda sobre estos términos, escríbenos a{" "}
            <a href="mailto:legal@merma.mx" className="text-purple-400 underline">legal@merma.mx</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
