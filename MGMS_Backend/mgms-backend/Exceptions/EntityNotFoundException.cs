namespace mgms_backend.Exceptions
{
    // Exception thrown when an entity is not found in the database
    public class EntityNotFoundException : Exception
    {
        public EntityNotFoundException(string message) : base(message)
        {
        }
    }
}