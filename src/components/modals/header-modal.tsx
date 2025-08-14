interface HeaderModalProps {
  imageUrl: string;
}

export const HeaderModal = ({ imageUrl }: HeaderModalProps) => {
  return (
    <div className="h-[200px] w-full">
      <img src={imageUrl} alt="header-modal" className="h-full w-full object-cover" />
    </div>
  )
}
