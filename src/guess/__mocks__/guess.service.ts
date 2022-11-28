export const GuessService = jest.fn().mockReturnValue({
  //guess service return values
  createGuess: jest.fn().mockReturnValue('dd'),
  updateGuess: jest.fn().mockReturnValue('userStub().user'),
  getGuessesByUserId: jest.fn().mockReturnValue('userStub().user'),
  getGuessesByLocationId: jest.fn().mockReturnValue('userStub().user'),
  //guess controller return values
});
