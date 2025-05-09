import Image from "next/image"

export default function Logo() {
  return (
    <div className="flex items-center mb-4">
      <Image
        src="/logo-lasalle.png"
        alt="Universidad La Salle Logo"
        width={150}
        height={50}
        className="object-contain"
      />
    </div>
  )
}
