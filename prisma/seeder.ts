import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  const availability = await prisma.availability.createMany({
    data: [
      { id: 1, day: 'Lunes' },
      { id: 2, day: 'Martes' },
      { id: 3, day: 'Miercoles' },
      { id: 4, day: 'Jueves' },
      { id: 5, day: 'Viernes' },
      { id: 6, day: 'Sabado' },
      { id: 7, day: 'Domingo' },
    ],
    skipDuplicates: true,
  });

  const skill = await prisma.skill.createMany({
    data: [
      { id: 1, description: 'Setup' },
      { id: 2, description: 'Coordination' },
      { id: 3, description: 'Customer Service' },
      { id: 4, description: 'AV Equipment' },
      { id: 5, description: 'Lighting' },
      { id: 6, description: 'Sound Systems' },
      { id: 7, description: 'Inventory' },
      { id: 8, description: 'Transportation' },
      { id: 9, description: 'Vendor Management' },
      { id: 10, description: 'Security' },
      { id: 11, description: 'First Aid' },
      { id: 12, description: 'Food Service' },
      { id: 13, description: 'Registration' },
      { id: 14, description: 'Cleaning' },
      { id: 15, description: 'Photography' },
    ],
    skipDuplicates: true,
  });

  const role = await prisma.role.createMany({
    data: [
      { id: 1, description: 'Event Coordinator' },
      { id: 2, description: 'Technical Support' },
      { id: 3, description: 'Logistics Manager' },
      { id: 4, description: 'Security Personnel' },
      { id: 5, description: 'Catering Staff' },
      { id: 6, description: 'Registration Assistant' },
      { id: 7, description: 'Venue Manager' },
      { id: 8, description: 'AV Technician' },
      { id: 9, description: 'Transportation Coordinator' },
      { id: 10, description: 'Cleaning Staff' },
    ],
    skipDuplicates: true,
  });

  const category = await prisma.category.createMany({
    data: [
      { id: 1, description: 'Alquiler' },
      { id: 2, description: 'Reserva' },
      { id: 3, description: 'Marketing' },
      { id: 4, description: 'Publicidad' },
      { id: 5, description: 'Comida' },
      { id: 6, description: 'Transporte' },
      { id: 7, description: 'Entretenimiento' },
      { id: 8, description: 'Otros' },
    ],
    skipDuplicates: true,
  })

  const typeEvent = await prisma.typeEvent.createMany({
    data: [
      { id: 1, description: 'Piñata' },
      { id: 2, description: 'Mini Show' },
      { id: 3, description: 'Show' },
      { id: 4, description: 'Entrevista' },
      { id: 5, description: 'Programa de Radio' },
      { id: 6, description: 'Beneficio' },
    ],
    skipDuplicates: true,
  })

  console.log({ availability, skill, role, category, typeEvent })

};

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })