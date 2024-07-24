import { AccountRepository } from "../../infra/repository/AccountRepository"
import RideRepository from "../../infra/repository/RideRepository"

export default class GetRide {
    constructor(
        readonly accountRepository: AccountRepository,
        readonly rideRepository: RideRepository
    ) {}

    async execute(input: Input): Promise<Output | null> {
        const ride = await this.rideRepository.getRideById(input.rideId)
        const passenger = await this.accountRepository.getAccountById(ride.passengerId)
        if (!passenger) return null
        return {
            rideId: ride.rideId,
            passengerId: ride.passengerId,
            fromLat: ride.fromLat,
            fromLong: ride.fromLong,
            toLat: ride.toLat,
            toLong: ride.toLong,
            status: ride.status,
            passengerName: passenger.name,
            passengerEmail: passenger.email,
        }
    }
}

// DTO
type Input = {
    rideId: string
}

// DTO
type Output = {
    rideId: string
    passengerId: string
    fromLat: number
    fromLong: number
    toLat: number
    toLong: number
    status: string
    passengerName: string
    passengerEmail: string
}
