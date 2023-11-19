using System.ComponentModel.DataAnnotations;

namespace Contacts.Models
{
    public class Contact
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string MobilePhone { get; set; }
        public string JobTitle { get; set; }
        public DateTime BirthDate { get; set; }
    }
}
