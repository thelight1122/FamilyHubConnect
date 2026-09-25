import useLiveQuery, { combine } from './useLiveQuery';

export default function usePets(familyId: string | undefined) {
  const query = useLiveQuery(familyId, { pets: [], feedings: [], walks: [], appointments: [] }, async (db, fid) => {
    const since = new Date();
    since.setDate(since.getDate() - 7);
    return combine({
      pets: await db.from('pets').select('id, name, species, birth_date, weight_kg').eq('family_id', fid).order('created_at'),
      feedings: await db.from('pet_feedings').select('id, pet_id, label, time_of_day').eq('family_id', fid).order('time_of_day'),
      walks: await db
        .from('pet_walks')
        .select('id, pet_id, walked_by, walked_at, minutes, distance_km')
        .eq('family_id', fid)
        .gte('walked_at', since.toISOString())
        .order('walked_at', { ascending: false }),
      appointments: await db
        .from('vet_appointments')
        .select('id, pet_id, scheduled_at, reason')
        .eq('family_id', fid)
        .gte('scheduled_at', new Date().toISOString())
        .order('scheduled_at'),
    });
  });

  return {
    ...query.data,
    live: query.live,
    error: query.error,
    addPet: (pet: { name: string; species: string; birthDate: string; weightKg: string }) =>
      query.write((db, fid) =>
        db.from('pets').insert({
          family_id: fid,
          name: pet.name.trim(),
          species: pet.species.trim(),
          birth_date: pet.birthDate || null,
          weight_kg: pet.weightKg ? Number(pet.weightKg) : null,
        })
      ),
    addFeeding: (petId: string, label: string, timeOfDay: string) =>
      query.write((db, fid) => db.from('pet_feedings').insert({ pet_id: petId, family_id: fid, label: label.trim(), time_of_day: timeOfDay })),
    logWalk: (petId: string, minutes: number, distanceKm: number | null) =>
      query.write((db, fid, uid) =>
        db.from('pet_walks').insert({ pet_id: petId, family_id: fid, walked_by: uid, minutes, distance_km: distanceKm })
      ),
    addAppointment: (petId: string, scheduledAt: string, reason: string) =>
      query.write((db, fid) =>
        db.from('vet_appointments').insert({ pet_id: petId, family_id: fid, scheduled_at: new Date(scheduledAt).toISOString(), reason: reason.trim() })
      ),
  };
}
