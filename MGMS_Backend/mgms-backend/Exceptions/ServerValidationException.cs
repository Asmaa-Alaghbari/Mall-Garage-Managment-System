namespace mgms_backend.Exceptions
{
    // Exception thrown when a server validation fails 
    public class ServerValidationException : Exception
    {
        public ServerValidationException(string message) : base(message)
        {
        }
    }
}
