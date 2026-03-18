export function notifyReservationCreated(userEmail: string) {
    console.log(`📩 Notification: Nouvelle réservation envoyée par ${userEmail}`);
  }
  
  export function notifyReservationAccepted(userEmail: string) {
    console.log(`✅ Notification: Réservation acceptée pour ${userEmail}`);
  }
  
  export function notifyReservationRefused(userEmail: string) {
    console.log(`❌ Notification: Réservation refusée pour ${userEmail}`);
  }