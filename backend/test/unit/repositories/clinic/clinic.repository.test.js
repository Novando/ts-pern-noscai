jest.mock('dayjs');

const { Pool } = require('pg');
const { ClinicRepository } = require('../../../../src/repositories/clinic/clinic.repository')
const { AppError } = require('../../../../src/utils/error.util');

// Mock the pg module
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe('ClinicRepository', () => {
  let clinicRepository;
  let mockPool;

  // Sample clinic data
  const mockClinics = [
    { id: 1, name: 'Dental Clinic', address: '123 Main St' },
    { id: 2, name: 'Eye Clinic', address: '456 Oak St' },
  ];

  // Transformed clinic data (what we expect after mapping)
  const expectedClinics = [
    { id: 1, name: 'Dental Clinic' },
    { id: 2, name: 'Eye Clinic' },
  ];

  beforeEach(() => {
    // Create a new instance of the repository with a mock pool
    mockPool = new Pool();
    clinicRepository = new ClinicRepository(mockPool);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  describe('getClinics', () => {
    it('should return a list of clinics with id and name only', async () => {
      // Arrange
      mockPool.query.mockResolvedValueOnce({
        rows: mockClinics,
        rowCount: mockClinics.length
      });

      // Act
      const result = await clinicRepository.getClinics();

      // Assert
      expect(result).toEqual(expectedClinics);
      expect(mockPool.query).toHaveBeenCalledTimes(1);
    });

    it('should throw NOT_FOUND error when no clinics are found', async () => {
      // Arrange
      mockPool.query.mockResolvedValueOnce({
        rows: [],
        rowCount: 0
      });

      // Act & Assert
      await expect(clinicRepository.getClinics())
        .rejects
        .toThrow(AppError);

      await expect(clinicRepository.getClinics())
        .rejects
        .toHaveProperty('statusCode', 404);
    });

    it('should rethrow database errors', async () => {
      // Arrange
      const dbError = new Error('Database connection failed');
      mockPool.query.mockRejectedValueOnce(dbError);

      // Act & Assert
      await expect(clinicRepository.getClinics())
        .rejects
        .toThrow(dbError);
    });
  });
});
