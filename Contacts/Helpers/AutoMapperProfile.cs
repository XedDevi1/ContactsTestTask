using AutoMapper;
using Contacts.Dto;
using Contacts.Models;

namespace Contacts.Helpers
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            CreateMap<Contact, ContactDto>();
        }
    }
}
