import { Router } from 'express';
import { AddressController } from '../controllers/AddressController';
import { AddressUseCases } from '../../domain/usecases/AddressUseCases';
import { TypeOrmAddressRepository } from '../../infrastructure/repositories/TypeOrmLocationRepositories';

const router = Router();

// Crear instancias
const addressRepository = new TypeOrmAddressRepository();
const addressUseCases = new AddressUseCases(addressRepository);
const addressController = new AddressController(addressUseCases);

// Rutas
router.post('/addresses', (req, res) => addressController.createAddress(req, res));
router.get('/addresses', (req, res) => addressController.getAllAddresses(req, res));
router.get('/addresses/:id', (req, res) => addressController.getAddressById(req, res));
router.get('/addresses/locality/:localityId', (req, res) => addressController.getAddressesByLocalityId(req, res));
router.put('/addresses/:id', (req, res) => addressController.updateAddress(req, res));
router.delete('/addresses/:id', (req, res) => addressController.deleteAddress(req, res));

export { router as addressRoutes };
